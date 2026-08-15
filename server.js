const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());

// 外部ライブラリ不要のCORS許可設定
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});


const APP_ID = process.env.APP_ID || '6a7987969b239d1da6e89505';
const APP_SECRET = process.env.APP_SECRET || 'YOUR_APP_SECRET';
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'bf5d7f6fbc24d129ff5d833854e576b2c80f9e085368a2bd5fb3748c04130f22';
const BASE_URL = 'https://cloud.handcash.io/v3';

const getHeaders = () => ({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'app-id': APP_ID,
    'app-secret': APP_SECRET,
    'authorization': `Bearer ${AUTH_TOKEN}`
});

// トップページステータス
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>QLUX Multi-Gateway Backend</title>
                <style>
                    body { font-family: sans-serif; background: #0f172a; color: #f8fafc; text-align: center; padding-top: 50px; }
                    .card { background: #1e293b; display: inline-block; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
                    h1 { color: #38bdf8; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>QLUX Multi-Payment API Backend</h1>
                    <p>Status: <span style="color: #4ade80;">Running Successfully (HandCash + Stripe) 🚀</span></p>
                </div>
            </body>
        </html>
    `);
});

/**
 * ① HandCash APIプロキシ層
 */
app.post('/api/payment-requests', async (req, res) => {
    try {
        const { productName, amount, destinationHandle } = req.body;
        const payload = {
            product: { name: productName || 'QLUX Item', description: 'QLUX Ecosystem' },
            instrumentCurrencyCode: 'BSV',
            currency: 'USD',
            receivers: [{ destination: destinationHandle, sendAmount: Number(amount) }],
            expirationType: 'never'
        };

        const response = await fetch(`${BASE_URL}/paymentRequests`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) return res.status(response.status).json({ success: false, error: data });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * ② 日本市場向け：Stripe 決済セッション作成エンドポイント
 */
app.post('/api/create-stripe-checkout', async (req, res) => {
    try {
        const { productName, amountUSD } = req.body;
        const unitAmountJPY = Math.round(Number(amountUSD) * 150 * 100); // USDから日本円換算（セント単位）

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'jpy',
                        product_data: {
                            name: productName || 'QLUX Journal Access',
                        },
                        unit_amount: unitAmountJPY,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `https://qluxportal01.onrender.com/?success=true`,
            cancel_url: `https://qluxportal01.onrender.com/?canceled=true`,
        });

        res.json({ success: true, url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`QLUX Multi-Gateway Backend running on port ${PORT}`);
});

