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
const predictiveCache = new Map();
const activeVipTokens = new Set();
const processedTxs = new Set();

function generateSingularityPayload(index) {
    globalRequestCounter++;
    const peakMultiplier = 1 + (globalRequestCounter % 1000) / 300;
    const dynamicFee = Math.max(15, Math.floor((index % 7) + 5) * peakMultiplier);
    
    const payload = {
        id: index,
        epoch: "2026.08.23.PEAK",
        sector_dimension: "SYNCHULARITY-LATTICE-QUANTUM",
        fee_sats: dynamicFee,
        access: "paid",
        zk_proof_hash: "0zk_hyper_proof_" + index
    };
    predictiveCache.set(index, payload);
    return payload;
}

const JOURNALS = {};
for (let i = 1; i <= 2000; i++) {
    JOURNALS[i] = generateSingularityPayload(i);
}

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

// --- 【完全統合】Qlux 統合パルス経済・マネー錬成エンジン ---
app.get('/api/pulse', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const pulseInterval = setInterval(() => {
        try {
            const entropyMetric = (Math.random() * 80 + 20).toFixed(2);
            const minedSats = (entropyMetric * 0.05).toFixed(4); // ナノサトシ錬成
            
            const sponsorColors = ['#00f2fe', '#ff007f', '#7928ca', '#0070f3'];
            const activeSponsorColor = sponsorColors[Math.floor(Date.now() / 10000) % sponsorColors.length];

            const pulseData = JSON.stringify({
                timestamp: Date.now(),
                entropy: entropyMetric,
                mining_reward_sats: minedSats,
                sponsor_color: activeSponsorColor,
                status: "Achronal Sovereign Pulse [Monetized Core Active]"
            });

            res.write(`data: ${pulseData}\n\n`);
        } catch (err) {
            console.error("Pulse emission error:", err);
        }
    }, 2000);

    req.on('close', () => {
        clearInterval(pulseInterval);
    });
});

// 外部AI・エージェント向けマイクロ決済ゲート
app.all('/api/sovereign-stream', async (req, res) => {
    const authHeader = req.headers['authorization'] || req.headers['x-payment-payload'];
    if (!authHeader) {
        return res.status(402).json({
            error: "Payment Required",
            protocol: "BSV Nano-Settlement Hyper",
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
        data_sector: "Sovereign Economic Data Stream",
        entropy_state: "Maximum",
        timestamp: Date.now()
    });
});

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // /api/pulse や /api/sovereign-stream などのAPIリクエストをExpressへ直結
    if (pathname.startsWith('/api/')) {
        return app(req, res);
    }

    // デフォルトで absolute.html を配信するように変更
    let targetFile = pathname === '/' ? '/absolute.html' : pathname;
    let filePath = path.join(__dirname, targetFile);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
                status: "OMEGA MATRIX ACTIVE (SDK v3)",
                handcash_handle: "connected_sovereign",
                wallet_id: "6a3b47d3673f825c523af052",
                bsv_address: TARGET_BSV_ADDRESS,
                matrix: {
                    layers: "1-5 Sovereign Core Active",
                    protocol: "QLUX-OMEGA-MATRIX",
                    shield: "Immunity Boost Enabled",
                    global_requests: globalRequestCounter
                }
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

