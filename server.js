const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 10000;
const TARGET_BSV_ADDRESS = process.env.WALLET_ID || '1144ctcRnSuvCKFwNn9Wc2v1WvXv2N4vWn';

let globalRequestCounter = 105180;

// BSVトランザクション検証
async function verifyBSVTransaction(txid) {
    return new Promise((resolve) => {
        const apiUri = `https://api.whatsonchain.com/v1/bsv/main/tx/hash/${txid}`;
        https.get(apiUri, (res) => {
            let data = "";
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(!!(parsed && parsed.txid));
                } catch (e) {
                    resolve(false);
                }
            });
        }).on('error', () => resolve(false));
    });
}

// サーバーメイン処理（標準モジュールのみで完結）
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // 1. パルス経済ストリーム (/api/pulse)
    if (pathname === '/api/pulse') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no' // Render/Nginxでのバッファリング無効化
        });

        // 接続直後に即座に初期データを送信する関数
        const sendPulse = () => {
            try {
                const entropyMetric = (Math.random() * 80 + 20).toFixed(2);
                const minedSats = (entropyMetric * 0.05).toFixed(4);
                
                const sponsorColors = ['#00f2fe', '#ff007f', '#7928ca', '#0070f3'];
                const activeSponsorColor = sponsorColors[Math.floor(Date.now() / 10000) % sponsorColors.length];

                const pulseData = JSON.stringify({
                    timestamp: Date.now(),
                    entropy: entropyMetric,
                    mining_reward_sats: minedSats,
                    sponsor_color: activeSponsorColor,
                    status: "Achronal Sovereign Pulse Active"
                });

                res.write(`data: ${pulseData}\n\n`);
            } catch (err) {
                console.error("Pulse error:", err);
            }
        };

        sendPulse(); // 接続確立と同時に1発目を即時送信
        const pulseInterval = setInterval(sendPulse, 2000); // 以降2秒おき

        req.on('close', () => {
            clearInterval(pulseInterval);
        });
        return;
    }

    // 2. マイクロ決済ゲート (/api/sovereign-stream)
    if (pathname === '/api/sovereign-stream') {
        const authHeader = req.headers['authorization'] || req.headers['x-payment-payload'];
        if (!authHeader) {
            res.writeHead(402, { 'Content-Type': 'application/json; charset=utf-8' });
            return res.end(JSON.stringify({
                error: "Payment Required",
                protocol: "BSV Nano-Settlement",
                target_address: TARGET_BSV_ADDRESS,
                required_fee_sats: "10 Sats"
            }));
        }

        const isValid = await verifyBSVTransaction(authHeader);
        res.writeHead(isValid ? 200 : 402, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(isValid ? {
            status: "HYPER_SUCCESS",
            entropy_state: "Maximum",
            timestamp: Date.now()
        } : {
            error: "BSV Payment verification failed."
        }));
    }

    // 3. 静的ファイル（absolute.html等）の配信
    let targetFile = pathname === '/' ? '/absolute.html' : pathname;
    let filePath = path.join(__dirname, targetFile);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
                status: "OMEGA MATRIX ACTIVE (Zero Dependency)",
                bsv_address: TARGET_BSV_ADDRESS,
                global_requests: ++globalRequestCounter
            }));
        } else {
            let ext = path.extname(filePath);
            let contentType = 'text/html; charset=utf-8';
            if (ext === '.js') contentType = 'application/javascript; charset=utf-8';
            if (ext === '.css') contentType = 'text/css; charset=utf-8';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Qlux Sovereign Core active on port ${PORT}`);
});

