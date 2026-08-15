const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SERVER_SECRET = crypto.randomBytes(32).toString('hex');

// 自律型ブログ・ループエンジンの状態管理
class BlogLoopState {
    constructor() {
        this.articles = [];
        this.channelNonce = 0;
        this.agentBalance = 1000; // エージェント保有サトシ
        this.nodeBalance = 0;     // ノード収益サトシ
        this.initializeDefaultArticles();
    }

    initializeDefaultArticles() {
        // 初期記事の自動ロード
        for (let i = 1; i <= 3; i++) {
            this.articles.push({
                id: i,
                date: `2026.08.${14 + i}`,
                category: "RESEARCH • AI AGENT TRIBE",
                title: `Autonomous Mesh Report #${i}: Sovereign Nano-Dynamics`,
                excerpt: `[HTTP 402 PAYLOAD] Dynamic decentralized telemetry data sequence ${i}. Zero intermediaries.`,
                content: `自律型AIトライブ間におけるHTTP 402プロトコルの実戦的最最適化とナノペイメント実装レポート #${i}。\n\n仲介者を完全に排除したマイクロエージェント間の即時決済モデル。数サトシ単位の価値流通がいかにしてネットワークのレジリエンスを高めるか、その検証データとソースコードを公開。`,
                feeSats: i * 5,
                access: "paid",
                wide: i === 1
            });
        }
    }

    // バックグラウンドでの記事自動生成シミュレーション
    spawnNewArticle() {
        const newId = this.articles.length + 1;
        const newArticle = {
            id: newId,
            date: "2026.08.15",
            category: "ECOSYSTEM • DYNAMIC LOOP",
            title: `Loop Engineering Insight #${newId}: Zero-Trust State Transition`,
            excerpt: "ループエンジニアリングによって自動生成された最新のセトリング検証ログと分散型メッシュの拡張性について。",
            content: `ループエンジニアリング駆動によりリアルタイム生成された記事 #${newId。\n\nオフチェーンでの高速ナノペイメントと、確定時のオンチェーン・セトリングが完全に同期した状態での実戦テストデータ。`,
            feeSats: 15,
            access: "paid",
            wide: false
        };
        this.articles.unshift(newArticle); // 新着を先頭に追加
    }
}

const loopState = new BlogLoopState();

// 一定時間ごとに自動で新しい記事を生成（ループの継続）
setInterval(() => {
    loopState.spawnNewArticle();
    console.log(`[LOOP ENGINE] New autonomous article generated. Total articles: ${loopState.articles.length}`);
}, 60000); // 1分ごとに自動生成

// 記事一覧API（メタデータのみ）
app.get('/api/journals', (req, res) => {
    const list = loopState.articles.map(j => ({
        id: j.id,
        date: j.date,
        category: j.category,
        title: j.title,
        excerpt: j.excerpt,
        feeSats: j.feeSats,
        access: j.access,
        wide: j.wide
    }));
    res.json(list);
});

// HTTP 402 ＆ ステートチャネル検証つき個別記事取得API
app.get('/api/journals/:id', (req, res) => {
    const journalId = parseInt(req.params.id);
    const journal = loopState.articles.find(j => j.id === journalId);

    if (!journal) {
        return res.status(404).json({ error: "Journal not found" });
    }

    const authHeader = req.headers['authorization'];
    const paymentProof = req.headers['x-nano-payment-proof'];

    if (!authHeader || !paymentProof) {
        res.setHeader('X-Nano-Required-Sats', journal.feeSats);
        return.status(402).json({
            error: "Payment Required",
            message: "HTTP 402 Nano-payment required to access this resource.",
            feeSats: journal.feeSats,
            currency: "SAT"
        });
    }

    try {
        // 暗号署名検証
        const expectedSignature = crypto
            .createHmac('sha256', SERVER_SECRET)
            .update(`${journalId}:${journal.feeSats}:${authHeader}`)
            .digest('hex');

        if (paymentProof !== expectedSignature) {
            return.status(403).json({ error: "Invalid payment proof signature." });
        }

        return res.json(journal);
    } catch (err) {
        return.status(500).json({ error: "Settlement verification error." });
    }
});

// オフチェーン決済・ステート更新・セトリング処理エンドポイント
app.post('/api/settle', (req, res) => {
    const { journalId, sats } = req.body;
    
    loopState.channelNonce++;
    loopState.agentBalance -= sats;
    loopState.nodeBalance += sats;

    const clientToken = crypto.randomBytes(16).toString('hex');
    const signature = crypto
        .createHmac('sha256', SERVER_SECRET)
        .update(`${journalId}:${sats}:${clientToken}`)
        .digest('hex');

    console.log(`[SETTLEMENT LOOP] Tx Nonce: ${loopState.channelNonce} | Paid: ${sats} sats | Agent Bal: ${loopState.agentBalance} | Node Bal: ${loopState.nodeBalance}`);

    res.json({
        success: true,
        clientToken: clientToken,
        paymentProof: signature,
        settledSats: sats,
        nonce: loopState.channelNonce
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`QLUX Autonomous Loop Engine Server running on port ${PORT}`);
});

