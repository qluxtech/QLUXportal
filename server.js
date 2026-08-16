const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 10000;

// BSV 決済受取用アドレス（完全直結）
const TARGET_BSV_ADDRESS = "1Mb66iHohUEg8AnkgV9uTTV7R235tuy95";

// 冪等性（重複決済・無限ループ防止）のためのメモリキャッシュ
const processedTxs = new Set();

// インメモリのジャーナルデータベース
const JOURNALS = {
    1: {
        date: "2026.08.14 // RESEARCH - AI AGENT TRIBE",
        title: "自律型AIトライブ間におけるHTTP 402プロトコルの実践的最適化とナノペイメント実装",
        content: "自律型AIトライブ間におけるHTTP 402プロトコルの実践的最適化とナノペイメント実装の最新リサーチ。AI仲介者を完全に排除し、ミリ秒単位で富とデータを循環させる経済要塞のコアロジック。",
        fee: 10,
        access: "paid"
    },
    2: {
        date: "2026.08.01 // ARCHITECTURE",
        title: "プラネタリー・メッシュにおけるゼロトラスト自己修復フェーズ",
        content: "ハードウェアとソフトウェアの境界を溶解させる、次世代マテリアル・インフラストラクチャの設計思想に関するオープンリサーチデータ。",
        fee: 0,
        access: "free"
    },
    3: {
        date: "2026.07.22 // ECOSYSTEM",
        title: "ゼロ知識暗号コンパイルと無共有制限の独立自己修復アルゴリズム",
        content: "グローバル規模の障害シミュレーションから導き出された、完全自律型ネットワークのレジリエンス強化アプローチの全記録。",
        fee: 5,
        access: "paid"
    },
    4: {
        date: "2026.08.14 // RESEARCH - AI AGENT TRIBE",
        title: "境界なき廊下へ、完璧なる独占を。QLUXがデザインする次世代の決済基盤",
        content: "遅延も、手数料の壁も、国境もない。AIとシステムが同期的に交信し、ナノ単位の情報を瞬時に約定させる。私たちが構築した要塞の全貌。",
        fee: 10,
        access: "paid"
    }
};

// WhatsOnChain API を用いたBSVトランザクションのリアルタイム検証関数
function verifyBSVTransaction(txid) {
    return new Promise((resolve) => {
        const apiUri = `https://api.whatsonchain.com/v1/bsv/main/tx/hash/${txid}`;
        https.get(apiUri, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    if (res.statusCode !== 200) {
                        return resolve(false);
                    }
                    const txData = JSON.parse(data);
                    if (txData && txData.vout) {
                        const isValid = txData.vout.some(out => 
                            out.scriptPubKey && 
                            out.scriptPubKey.addresses && 
                            out.scriptPubKey.addresses.includes(TARGET_BSV_ADDRESS)
                        );
                        return resolve(isValid);
                    }
                    resolve(false);
                } catch (e) {
                    resolve(false);
                }
            });
        }).on('error', () => {
            resolve(false);
        });
    });
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // APIエンドポイント: ジャーナルデータ取得 & HTTP 402 / BSVナノ決済検証
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

        // 有料記事：HTTP 402 決済ヘッダー（Authorization または X-Proof / X-Payment-Txid）の確認
        const authHeader = req.headers['authorization'] || req.headers['x-proof'] || req.headers['x-payment-txid'];
        
        if (!authHeader) {
            res.writeHead(402, {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Payment-Required': 'BSV Nano-Settlement',
                'X-Target-Address': TARGET_BSV_ADDRESS,
                'X-Payment-Fee': `${journal.fee} Sats`
            });
            res.end(JSON.stringify({
                error: "Payment Required",
                protocol: "HTTP_402_ULTRA_BSV",
                settlement_dest: TARGET_BSV_ADDRESS,
                fee_sats: journal.fee,
                message: `HTTP 402: Send BSV to ${TARGET_BSV_ADDRESS} and pass txid via 'X-Payment-Txid' or 'Authorization' header to unlock stream.`
            }));
            return;
        }

        // 冪等性チェック（無限ループおよび同一トランザクションの二重取得を完全ブロック）
        if (processedTxs.has(authHeader)) {
            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: "Idempotency Shield: Transaction ID already processed or duplicate loop blocked." }));
            return;
        }

        // ブロックチェーン検証の実行
        const isValid = await verifyBSVTransaction(authHeader);
        if (!isValid) {
            res.writeHead(402, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: "BSV Payment verification failed: Target address mismatch or invalid txid." }));
            return;
        }

        // 決済成功・冪等性登録・PoUWフィードバック記録
        processedTxs.add(authHeader);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            status: "SUCCESS",
            pouw_feedback: "ACTIVE",
            txid: authHeader,
            journal: journal
        }));
        return;
    }

    // APIエンドポイント: ナノ決済実行シミュレーション
    if (pathname === '/api/settle' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ 
                status: "success", 
                dest: TARGET_BSV_ADDRESS,
                txid: "0xqlux_nano_settled_" + Date.now(),
                shield: "active"
            }));
        });
        return;
    }

    // 静的ファイルの配信 (SPAフォールバック対応)
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    fs.readFile(filePath, (err, content) => {
        if (err) {
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
            let contentType = 'text/html';
            if (ext === '.js') contentType = 'text/javascript';
            if (ext === '.css') contentType = 'text/css';
            if (ext === '.json') contentType = 'application/json';

            res.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`[QLUX L0 KERNEL] Sovereign Backend running on port ${PORT}`);
    console.log(`[TARGET WALLET] ${TARGET_BSV_ADDRESS}`);
});

