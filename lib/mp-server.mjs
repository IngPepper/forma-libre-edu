// --- Importaciones ---
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import PDFDocument from 'pdfkit';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// --- Configuración dotenv con ruta absoluta a la raíz del proyecto ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Si .env está en la raíz del proyecto:
dotenv.config({ path: path.join(__dirname, '../.env') });

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error("No se ha definido MERCADOPAGO_ACCESS_TOKEN");
}
console.log('TOKEN:', process.env.MERCADOPAGO_ACCESS_TOKEN);

// --- Inicializar Firebase Admin ---
import serviceAccount from '../scripts/formalibre-7c32c-firebase-adminsdk-fbsvc-1aec0543f7.json' with { type: "json" };
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();

// --- Inicializar Mercado Pago ---
const mp = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });

// --- Crear servidor Express ---
const app = express();

// --- CORS bien configurado ---
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true, // si usas cookies, si no, puedes quitarlo
}));

app.use(express.json());

// --- Endpoint: Crear orden y preferencia de Mercado Pago ---
app.post('/api/create-preference', async (req, res) => {
    console.log('REQ.BODY RECIBIDO EN EXPRESS:', JSON.stringify(req.body, null, 2));
    try {
        const { items, nombre, correo, uid, razonSocial, rfc, direccion, total } = req.body;

        if (!items || !items.length || !nombre || !correo) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        // 1. Guarda la orden/pre-factura en Firestore
        const ordenData = {
            uid: uid || null,
            nombre,
            email: correo,
            razonSocial: razonSocial || "",
            rfc: rfc || "",
            direccion: direccion || "",
            items,
            total: total || items.reduce((acc, i) => acc + i.precio * (i.cantidad || 1), 0),
            status: "pendiente",
            fecha: new Date(),
            emisor: {
                nombre: "Meow Meow Marlin",
                rfc: "MMM123456789",
                direccion: "Av. Catnip 45, CDMX"
            }
        };
        const ordenRef = await db.collection('ordenes').add(ordenData);
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

        // --- Corrige los items para Mercado Pago
        const mpItems = items.map(item => ({
            title: item.nombre || item.title || "Producto",
            quantity: item.cantidad || 1,
            currency_id: "MXN",
            unit_price: item.precio || item.unit_price || 0
        }));

        // --- Crea la preferencia de MP con external_reference
        const preference = {
            items: mpItems,
            payer: { name: nombre, email: correo },
            external_reference: ordenRef.id,
            back_urls: {
                success: `${FRONTEND_URL}/checkout/success`,
                failure: `${FRONTEND_URL}/checkout/failure`,
                pending: `${FRONTEND_URL}/checkout/pending`
            },
            //auto_return: "approved"
        };

        console.log('Preference enviada:', JSON.stringify(preference, null, 2));
        const preferenceClient = new Preference(mp);
        const response = await preferenceClient.create({ body: preference });

        res.json({ id: response.id || (response.body && response.body.id) });
    } catch (error) {
        console.error("Error en /api/create-preference:", error);
        res.status(500).json({ error: error.message || "Error interno" });
    }
});

// --- Endpoint: Webhook de Mercado Pago para registrar factura ---
app.post('/api/mp-webhook', async (req, res) => {
    try {
        const payment = req.body;
        const ordenId = payment.external_reference;

        // Busca la orden original en Firestore
        const ordenSnap = await db.collection("ordenes").doc(ordenId).get();
        const orden = ordenSnap.data();
        if (!orden) return res.status(404).json({ error: "Orden no encontrada" });

        if (payment.status === "approved") {
            await db.collection("facturas").add({
                ...orden,
                idPago: payment.id,
                metodoPago: payment.payment_method_id,
                status: payment.status,
                fechaPago: new Date(payment.date_approved),
                datosPago: payment,
                fechaRegistro: new Date()
            });
            await db.collection("ordenes").doc(ordenId).update({ status: "pagada" });
        }

        res.status(200).json({ ok: true });
    } catch (err) {
        console.error("Error en mp-webhook:", err);
        res.status(500).json({ error: "Error en webhook" });
    }
});

// --- Endpoint: Generar PDF de una factura guardada ---
// Ruta de tu logo (ajusta según tu estructura)
const logoPath = path.join(__dirname, '../public/assets/chrome02S_marron_192x192_t.png');

app.get('/api/factura-pdf/:id', async (req, res) => {
    const facturaId = req.params.id;
    try {
        const docSnap = await db.collection('facturas').doc(facturaId).get();
        if (!docSnap.exists) return res.status(404).send("Factura no encontrada");
        const factura = docSnap.data();

        const doc = new PDFDocument({ margin: 50 });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            res
                .set({
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename=factura_${facturaId}.pdf`
                })
                .send(pdfData);
        });

        // LOGO y encabezado bonito
        if (fs.existsSync(logoPath)) {
            try {
                doc.image(logoPath, 50, 50, { width: 100 });
            } catch (err) {
                console.error('Error cargando imagen en PDF:', err);
            }
        } else {
            console.log('Logo no encontrado:', logoPath);
        }
        doc.fontSize(22).fillColor("#7e6c37").text("Factura Electrónica", 0, 50, { align: "right" });

        doc.moveDown(2);

        // Línea divisoria
        doc.moveTo(50, 110).lineTo(550, 110).stroke("#bfa76d");
        doc.moveDown();

        // Datos de la factura y cliente en dos columnas
        doc.fontSize(10).fillColor("#222");
        doc.text(`Factura ID: ${facturaId}`);
        doc.text(`Fecha: ${new Date(factura.fechaPago || factura.fecha).toLocaleString("es-MX")}`);
        doc.moveDown(0.5);
        doc.text(`Cliente: ${factura.nombre} (${factura.email})`);
        if (factura.razonSocial) doc.text(`Razón Social: ${factura.razonSocial}`);
        if (factura.rfc) doc.text(`RFC: ${factura.rfc}`);
        if (factura.direccion) doc.text(`Dirección: ${factura.direccion}`);
        doc.moveDown(0.5);
        doc.text(`Emisor: ${factura.emisor?.nombre || ''}`);
        if (factura.emisor?.rfc) doc.text(`RFC Emisor: ${factura.emisor.rfc}`);
        if (factura.emisor?.direccion) doc.text(`Dirección Emisor: ${factura.emisor.direccion}`);

        doc.moveDown();

        // MÉTODO DE PAGO y DATOS
        doc.fontSize(10).fillColor("#555555");
        doc.text(`Método de pago: ${factura.metodoPago}`);
        doc.text(`ID de Pago: ${factura.idPago}`);

        doc.moveDown();

        // TABLA DE ITEMS BONITA
        doc.fontSize(12).fillColor("#7e6c37").text("Detalle de productos:", { underline: true });
        doc.moveDown(0.5);

        // Cabecera tabla
        doc.fontSize(10).fillColor("#222").text("Producto", 70, doc.y, { continued: true });
        doc.text("Cantidad", 250, doc.y, { continued: true });
        doc.text("Precio unitario", 340, doc.y, { continued: true });
        doc.text("Subtotal", 450, doc.y);
        doc.moveDown(0.2);
        // Línea bajo encabezado
        doc.moveTo(70, doc.y).lineTo(540, doc.y).stroke("#bfa76d");

        // Filas
        factura.items?.forEach(item => {
            doc.fontSize(10).fillColor("#333");
            doc.text(item.nombre, 70, doc.y, { continued: true });
            doc.text(item.cantidad || 1, 250, doc.y, { continued: true });
            doc.text(
                `$${item.precio?.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}`,
                340, doc.y, { continued: true }
            );
            doc.text(
                `$${((item.precio || 0) * (item.cantidad || 1)).toLocaleString("es-MX", { style: "currency", currency: "MXN" })}`,
                450, doc.y
            );
        });

        doc.moveDown(1);

        // Total grande
        doc.fontSize(14).fillColor("#7e6c37").text(
            `Total: $${(factura.total || 0).toLocaleString("es-MX", { style: "currency", currency: "MXN" })}`,
            { align: "right" }
        );

        doc.moveDown(2);
        // Pie de página con fondo suave y texto
        doc.rect(0, doc.page.height - 60, doc.page.width, 60)
            .fill("#f8f4ec")
            .stroke();
        doc.fillColor("#7e6c37").fontSize(11)
            .text("¡Gracias por tu compra!", 0, doc.page.height - 50, { align: "center" });
        doc.fontSize(9)
            .fillColor("#999").text("www.meowmeowmarlin.com", { align: "center" });

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).send("Error generando el PDF");
    }
});

// --- Iniciar servidor ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor MP corriendo en http://localhost:${PORT}`);
});
