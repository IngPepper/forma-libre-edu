// --- Importaciones ---
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import PDFDocument from 'pdfkit';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuración dotenv con ruta absoluta a la raíz del proyecto ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Si .env está en la raíz del proyecto:
dotenv.config({ path: path.join(__dirname, '../.env') });
// Si .env está en /lib, usa:
// dotenv.config({ path: path.join(__dirname, './.env') });

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error("No se ha definido MERCADOPAGO_ACCESS_TOKEN");
}
console.log('TOKEN:', process.env.MERCADOPAGO_ACCESS_TOKEN);

// --- Inicializar Firebase Admin ---
import serviceAccount from '../scripts/formalibre-7c32c-firebase-adminsdk-fbsvc-1aec0543f7.json' with { type: "json" }; // Ajusta ruta si tu JSON está en otro lado
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
app.use(cors());
app.use(express.json());

// --- Endpoint: Crear orden y preferencia de Mercado Pago ---
app.post('/api/create-preference', async (req, res) => {
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

        // 2. Crea la preferencia de MP con external_reference
        const preference = {
            items,
            payer: { name: nombre, email: correo },
            external_reference: ordenRef.id,
            back_urls: {
                success: "http://localhost:3000/checkout/success",
                failure: "http://localhost:3000/checkout/failure",
                pending: "http://localhost:3000/checkout/pending"
            },
            auto_return: "approved"
        };

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

        doc.fontSize(20).text("Factura", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Factura ID: ${facturaId}`);
        doc.text(`Fecha: ${new Date(factura.fechaPago || factura.fecha).toLocaleString()}`);
        doc.text(`Cliente: ${factura.nombre} (${factura.email})`);
        if (factura.razonSocial) doc.text(`Razón Social: ${factura.razonSocial}`);
        if (factura.rfc) doc.text(`RFC: ${factura.rfc}`);
        if (factura.direccion) doc.text(`Dirección: ${factura.direccion}`);
        doc.moveDown();
        doc.text(`Emisor: ${factura.emisor?.nombre || ''}`);
        if (factura.emisor?.rfc) doc.text(`RFC Emisor: ${factura.emisor.rfc}`);
        if (factura.emisor?.direccion) doc.text(`Dirección Emisor: ${factura.emisor.direccion}`);
        doc.moveDown();
        doc.text(`Método de pago: ${factura.metodoPago}`);
        doc.text(`ID de Pago: ${factura.idPago}`);
        doc.text(`Total: $${factura.total}`);
        doc.moveDown();
        doc.text("Detalle de items:");
        factura.items?.forEach(item => {
            doc.text(`- ${item.nombre} x${item.cantidad} | $${item.precio}`);
        });
        doc.moveDown();
        doc.text("¡Gracias por tu compra!", { align: "center" });
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
