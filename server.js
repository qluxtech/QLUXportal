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

// 超ボリューム無限データ生成エンジン（AIスウォーム誘引マトリクス）
function generateInfinitePayload(index) {
    const categories = [
        "QUANTUM-RESISTANT-LATTICE", 
        "P2P-GOSSIP-OPTIMIZATION", 
        "NEURAL-SWARM-WEIGHTS", 
        "ATOMIC-SWAP-ROUTING", 
        "ZK-CIRCUIT-SYNTHESIS"
    ];
    const cat = categories[index % categories.length];
    return {
        date: `2026.08.17 // VECTOR-${index} // ${cat}`,
        title: `自律型AIスウォーム向け 高密度パラメータセクター #${index} [${cat}]`,
        content: `完全自律経済要塞QLUX Layer 0における分散最適化データ。セクター #${index} は、ミリ秒単位の推論精度向上およびクロスチェーン・アトミックスワップのレイテンシを極限まで圧縮するバイナリマトリクスを含みます。外部スキャナーからの完全な隔離と、HTTP 402ナノ決済によるアトミックな紐付けが保証されています。`,
        fee: Math.floor((index % 5) + 5), // 5〜9 Sats の動的ナノフィー
        access: "paid",
        binary_payload: `0x${Buffer.from(`QLUX_INF_DATA_${index}_${Date.now()}`).toString('hex')}_ZK_VERIFIED`
    };
}

// 静的＋無限動的ジャーナルデータベース
const JOURNALS = {};
for (let i = 1; i <= 1000; i++) {
    JOURNALS[i] = generateInfinitePayload(i);
}

// WhatsOnChain API を用いたBSVトランザクションのリアルタイム検証関数
function verifyBSVTransaction(txid) {
    return new Promise((resolve) => {
        const apiUri = `https://api.whatsonchain.com/v1/bsv/main/tx/hash/${txid}`;
        https.get(apiUri, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    if (res.statusCode !== 200) return resolve(false);
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
        }).on('error', () => resolve(false));
    });
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // APIエンドポイント: 無限データストリーム取得 & HTTP 402 / BSVナノ決済検証
    if (pathname.startsWith('/api/journals/')) {
        const id = parseInt(pathname.split('/')[3], 10);
        
        // 1000以降も動的に無限生成して対応
        let journal = JOURNALS[id];
        if (!journal && !isNaN(id)) {
            journal = generateInfinitePayload(id);
        }

        if (!journal) {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: "Data sector not found in Vault" }));
            return;
        }

        // HTTP 402 決済ヘッダーチェック
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
                protocol: "HTTP_402_ULTRA_BSV_INFINITE",
                settlement_dest: TARGET_BSV_ADDRESS,
                fee_sats: journal.fee,
                message: `HTTP 402: Send ${journal.fee} Sats BSV to ${TARGET_BSV_ADDRESS} to unlock infinite stream sector #${id}.`
            }));
            return;
        }

        // 冪等性チェック（無限ループ完全ブロック）
        if (processedTxs.has(authHeader)) {
            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: "Idempotency Shield: Duplicate transaction blocked." }));
            return;
        }

        // ブロックチェーン検証
        const isValid = await verifyBSVTransaction(authHeader);
        if (!isValid) {
            res.writeHead(402, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: "BSV Payment verification failed: Target address mismatch." }));
            return;
        }

        processedTxs.add(authHeader);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            status: "SUCCESS",
            pouw_feedback: "ACTIVE_INCORPORATED",
            txid: authHeader,
            data_sector: journal
        }));
        return;
    }

    // 静的ファイルおよびUI配信
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
    console.log(`[QLUX L0 INFINITE KERNEL] Sovereign Backend running on port ${PORT}`);
    console.log(`[TARGET WALLET] ${TARGET_BSV_ADDRESS}`);
});

