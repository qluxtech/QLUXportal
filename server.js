const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 10000;

// インメモリのジャーナルデータベース
const JOURNALS = {
    1: {
        date: "2026.08.14 // RESEARCH • AI AGENT TRIBE",
        title: "自律型AIトライブ間におけるHTTP 402プロトコルの実戦的最最適化とナノペイメント実装",
        content: "自律型AIトライブ間におけるHTTP 402プロトコルの実戦的最最適化とナノペイメント実装の詳細レポート。\n\n仲介者を完全に排除したマイクロエージェント間の即時決済モデルにより、ネットワークのレジリエンスが劇的に向上するメカニズムを解説。\n\n【主要ハイライト】\n• ゼロ・インタミディアリー（仲介者ゼロ）による直接合意形成\n• 10サトシ単位でのアトミック決済トランザクション\n• 自律エージェントの負荷分散とノード協調プロセス",
        fee: 10,
        access: "paid"
    },
    2: {
        date: "2026.08.01 // ARCHITECTURE",
        title: "高密度物性コンパイルと熱共鳴制御の統合フェーズ",
        content: "ハードウェアとソフトウェアの境界を溶解させる、次世代マテリアル・インフラストラクチャの設計思想に関するオープンリサーチデータ。\n\n物理的構造体とデジタル制御層が完全に同期することで、エネルギー損失を極限まで低減させるアーキテクチャの全容を公開。",
        fee: 0,
        access: "free"
    },
    3: {
        date: "2026.07.22 // ECOSYSTEM",
        title: "プラネタリー・メッシュにおけるゼロトラスト自己修復アルゴリズム",
        content: "グローバル規模の障害シミュレーションから導き出された、完全自律型ネットワークのレジリエンス構築アプローチの全記録。\n\n障害発生時に中央サーバーを介さず、周辺ノードが自律的にルーティングを再構築するメカニズムについて詳解。",
        fee: 5,
        access: "paid"
    },
    4: {
        date: "2026.08.14 // RESEARCH • AI AGENT TRIBE",
        title: "境界なき知性へ、摩擦なき対価を。QLUXがデザインする次世代の決済基盤",
        content: "遅延も、手数料の壁も、国境もない。AIとシステムが自律的に交信し、ナノ単位の価値を瞬時に約定させる。\n\n私たちが構築した「数サトシの霊刀」が、世界の流通構造を根本から書き換えるパラダイムシフトの記録。",
        fee: 10,
        access: "paid"
    }
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // APIエンドポイント: ジャーナルデータ取得 & HTTP 402 シミュレーション
    if (pathname.startsWith('/api/journals/')) {
        const id = pathname.split('/')[3];
        const journal = JOURNALS[id];

        if (!journal) {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: "Journal not found" }));
            return;
        }

        // 無料記事の場合はそのまま返す
        if (journal.access === 'free') {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(journal));
            return;
        }

        // 有料記事で決済ヘッダー（Authorization または X-Proof）がない場合は 402 Payment Required を返す
        const authHeader = req.headers['authorization'] || req.headers['x-proof'];
        if (!authHeader) {
            res.writeHead(402, { 
                'Content-Type': 'application/json; charset=utf-8',
                'X-Payment-Fee': `${journal.fee} Sats`,
                'X-Lightning-Invoice': `lnbc${journal.fee}01...mock_invoice_hash`
            });
            res.end(JSON.stringify({ 
                error: "Payment Required", 
                fee: journal.fee, 
                message: `HTTP 402: Micro-settlement of ${journal.fee} Sats required to access this resource.` 
            }));
            return;
        }

        // 決済証明がある場合
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(journal));
        return;
    }

    // APIエンドポイント: ナノ決済実行シミュレーション
    if (pathname === '/api/settle' && method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: "success", txid: "0xqlux_nano_settled_" + Date.now() }));
        });
        return;
    }

    // 静的ファイル（index.html）の配信
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // ファイルがない場合は index.html をフォールバック（SPA対応）
            fs.readFile(path.join(__dirname, 'index.html'), (err2, fallbackContent) => {
                if (err2) {
                    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('404 Not Found');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(fallbackContent);
                }
            });
        } else {
            let ext = path.extname(filePath);
            let contentType = 'text/html; charset=utf-8';
            if (ext === '.js') contentType = 'text/javascript';
            if (ext === '.css') contentType = 'text/css';
            if (ext === '.json') contentType = 'application/json';
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`> QLUX Sovereign Backend running on port ${PORT}`);
});
