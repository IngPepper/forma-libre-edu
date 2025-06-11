import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';
dotenv.config();
console.log('TOKEN:', process.env.MERCADOPAGO_ACCESS_TOKEN);

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error("No se ha definido MERCADOPAGO_ACCESS_TOKEN");
}

const mp = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/create-preference', async (req, res) => {
    try {
        const { items, nombre, correo } = req.body;

        // Validación básica
        if (!items || !items.length || !nombre || !correo) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        // Log para debug
        console.log("Recibido:", JSON.stringify({ items, nombre, correo }, null, 2));

        const preference = {
            items: [
                {
                    title: "Producto prueba",
                    quantity: 1,
                    unit_price: 10,
                }
            ],
            payer: {
                email: "test_user_123456@testuser.com"
            },
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

app.listen(4000, () => {
    console.log("Servidor MP corriendo en http://localhost:4000");
});
