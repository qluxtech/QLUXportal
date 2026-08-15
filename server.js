const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(express.json());

/**
 * 根元（トップページ）へのアクセス用ハンドラー
 * ブラウザで開いたときに "Cannot GET /" にならないようにします
 */
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>QLUX HandCash Backend</title>
                <style>
                    body { font-family: sans-serif; background: #0f172a; color: #f8fafc; text-align: center; padding-top: 50px; }
                    .card { background: #1e293b; display: inline-block; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
                    h1 { color: #38bdf8; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>QLUX HandCash API Backend</h1>
                    <p>Status: <span style="color: #4ade80;">Running Successfully 🚀</span></p>
                    <p>Endpoint /api/payment-requests is ready.</p>
                </div>
            </body>
        </html>
    `);
});


// 環境変数または直接定義の認証情報
const APP_ID = process.env.APP_ID || '6a7987969b239d1da6e89505';
const APP_SECRET = process.env.APP_SECRET || 'YOUR_APP_SECRET';
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'bf5d7f6fbc24d129ff5d833854e576b2c80f9e085368a2bd5fb3748c04130f22';
const BASE_URL = 'https://cloud.handcash.io/v3';

// 共通ヘッダー（公式ドキュメント準拠：小文字の app-id, app-secret）
const getHeaders = () => ({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'app-id': APP_ID,
    'app-secret': APP_SECRET,
    'authorization': `Bearer ${AUTH_TOKEN}`
});

/**
 * ① APIプロキシ層：決済リクエスト（Payment Request）の作成
 * フロントエンドから安全に呼び出し、シークレットを隠蔽します
 */
app.post('/api/payment-requests', async (req, res) => {
    try {
        const { productName, amount, destinationHandle } = req.body;

        const payload = {
            product: {
                name: productName || 'QLUX Service Item',
                description: 'QLUX Ecosystem Payment'
            },
            instrumentCurrencyCode: 'BSV',
            currency: 'USD', // 正しいフィールド名を使用
            receivers: [
                {
                    destination: destinationHandle,
                    sendAmount: Number(amount)
                }
            ],
            expirationType: 'never'
        };

        const response = await fetch(`${BASE_URL}/paymentRequests`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({ success: false, error: data });
        }

        res.json({ success: true, data });
    } catch (error) {
        console.error('Payment Request Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * ② トランザクション・支払い履歴の管理・取得
 * 過去の支払いリクエスト一覧をリスト表示します
 */
app.get('/api/payment-requests', async (req, res) => {
    try {
        const { status } = req.query;
        let url = `${BASE_URL}/paymentRequests`;
        if (status) {
            url += `?status=${status}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders()
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({ success: false, error: data });
        }

        res.json({ success: true, data });
    } catch (error) {
        console.error('Get Payment Requests Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * ③ 支払いリクエストの削除（Delete）
 * 公式仕様：レスポンスが空ボディの場合があるためテキストとして安全に処理
 */
app.delete('/api/payment-requests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await fetch(`${BASE_URL}/paymentRequests/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : { success: true };

        if (!response.ok) {
            return res.status(response.status).json({ success: false, error: data });
        }

        res.json({ success: true, data });
    } catch (error) {
        console.error('Delete Payment Request Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * ④ Webhookエンドポイント
 * 決済完了やステータス変化をリアルタイムで受け取る
 */
app.post('/api/webhook', (req, res) => {
    const webhookData = req.body;
    console.log('--- Webhook Received ---', JSON.stringify(webhookData, null, 2));

    // ここでデータベースの更新やサービスの有効化処理を実行できます

    res.status(200).json({ received: true });
});

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`QLUX HandCash Backend running on port ${PORT}`);
});

