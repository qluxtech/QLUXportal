const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const express = require('express');

const app = express();
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

// --- パルス経済・マネー錬成ストリーム ---
app.get('/api/pulse', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const pulseInterval = setInterval(() => {
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
    }, 2000);

    req.on('close', () => {
        clearInterval(pulseInterval);
    });
});

// マイクロ決済ゲート
app.all('/api/sovereign-stream', async (req, res) => {
    const authHeader = req.headers['authorization'] || req.headers['x-payment-payload'];
    if (!authHeader) {
        return res.status(402).json({
            error: "Payment Required",
            protocol: "BSV Nano-Settlement",
            target_address: TARGET_BSV_ADDRESS,
            required_fee_sats: "10 Sats"
        });
    }

    const isValid = await verifyBSVTransaction(authHeader);
    if (!isValid) {
        return res.status(402).json({ error: "BSV Payment verification failed." });
    }

    res.json({
        status: "HYPER_SUCCESS",
        entropy_state: "Maximum",
        timestamp: Date.now()
    });
});

// サーバーメイン処理
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname.startsWith('/api/')) {
        return app(req, res);
    }

    let targetFile = pathname === '/' ? '/absolute.html' : pathname;
    let filePath = path.join(__dirname, targetFile);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
                status: "OMEGA MATRIX ACTIVE",
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
