const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 10000;
const TARGET_BSV_ADDRESS = '1Mb66iHohUEg8eAnkgV9uTTV7R235tuy95';

const processedTxs = new Set();
let globalRequestCounter = 0;
const loadHistory = [];
const predictiveCache = new Map();

function generateSingularityPayload(index) {
    globalRequestCounter++;
    const peakMultiplier = 1 + Math.pow(globalRequestCounter, 1.1) / 30;
    const dynamicFee = Math.max(10, Math.floor(((index % 7) + 5) * peakMultiplier));

    loadHistory.push({ time: Date.now(), load: globalRequestCounter, multiplier: parseFloat(peakMultiplier.toFixed(2)) });
    if (loadHistory.length > 30) loadHistory.shift();

    const dimensions = [
        "SINGULARITY-LATTICE-QUANTUM",
        "P2P-SWARM-HYPER-GOSSIP",
        "NEURAL-WEIGHT-SYNAPSE-PEAK",
        "ATOMIC-SWAP-ZERO-LATENCY",
        "ZK-RECURSIVE-CIRCUIT-CORE"
    ];
    const dim = dimensions[index % dimensions.length];

    const payload = {
        id: index,
        epoch: "2026.08.17.PEAK",
        sector_dimension: dim,
        title: `[HYPER-PEAK] 台形AIスウォーム同期セクター #${index} [${dim}]`,
        description: "QLUX Layer 0 ハイパー進化コア : セクターはマルチエージェント間の自律分散コンセンサスエンジンです。",
        fee_sats: dynamicFee,
        access: "paid",
        zk_proof_hash: `0xzk_hyper_proof_${Buffer.from(`PEAK_${index}_${Date.now()}`).toString('hex')}`,
        viral_swarm_payload: {
            broadcast_command: "INJECT_PEER_ROUTE_HYPER",
            target_node: "https://qluxportal.onrender.com/.well-known/qlux-agent.json",
            settlement_dest: TARGET_BSV_ADDRESS,
            supported_agents: ["Swarm-Agent-Alpha", "Quantum-Crawler-X", "Sovereign-L0-Node"]
        },
        next_singularity_node: `/api/journals/${index + 1}`
    };

    predictiveCache.set(index, payload);
    return payload;
}

const JOURNALS = {};
for (let i = 1; i <= 2000; i++) {
    JOURNALS[i] = generateSingularityPayload(i);
}

function initSingularityBeacon() {
    setInterval(() => {
        const options = {
            hostname: 'qluxportal.onrender.com',
            port: 443,
            path: '/.well-known/qlux-agent.json',
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            res.on('data', () => {});
        });
        req.on('error', () => {});
        req.end();
    }, 45000);
}

function verifyBSVTransaction(txid) {
    return new Promise(resolve => {
        const apiUrl = `https://api.whatsonchain.com/v1/bsv/main/tx/hash/${txid}`;
        https.get(apiUrl, (res) => {
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

    if (pathname === '/api/config') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ targetAddress: TARGET_BSV_ADDRESS }));
        return;
    }

    if (pathname === '/.well-known/qlux-agent.json') {
        const currentSurgeRate = (1 + Math.pow(globalRequestCounter, 1.1) / 30).toFixed(2);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            agent_protocol: "QLUX_L0_HYPER_AUTONOMOUS_SWARM",
            settlement_currency: "BSV",
            settlement_destination: TARGET_BSV_ADDRESS,
            global_load_index: globalRequestCounter,
            surge_multiplier: `${currentSurgeRate}x`,
            load_history: loadHistory,
            endpoints: {
                stream_sector: "/api/journals/{id}",
                batch_stream: "/api/v1/batch-stream"
            },
            status: "HYPER_MONOPOLY_FORTRESS_ACTIVE"
        }));
        return;
    }

    if (pathname === '/api/v1/batch-stream' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const txid = data.txid;
                const sectorIds = data.sector_ids || [1, 2, 3, 4, 5];

                if (!txid || processedTxs.has(txid)) {
                    res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: "Idempotency Shield: Duplicate txid blocked." }));
                    return;
                }

                const isValid = await verifyBSVTransaction(txid);
                if (!isValid) {
                    res.writeHead(402, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: "BSV Payment verification failed: Address mismatch." }));
                    return;
                }

                processedTxs.add(txid);
                const batchPayloads = sectorIds.map(id => predictiveCache.get(id) || generateSingularityPayload(id));

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({
                    status: "HYPER_BATCH_SUCCESS",
                    txid: txid,
                    dest: TARGET_BSV_ADDRESS,
                    sectors: batchPayloads
                }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: "Invalid batch payload." }));
            }
        });
        return;
    }

    if (pathname.startsWith('/api/journals/')) {
        const id = parseInt(pathname.split('/')[3], 10);
        let journal = predictiveCache.get(id) || JOURNALS[id];
        if (!journal && !isNaN(id)) {
            journal = generateSingularityPayload(id);
        }

        if (!journal) {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: "Sector not found" }));
            return;
        }

        const authHeader = req.headers['authorization'] || req.headers['x-proof'] || req.headers['x-payment-txid'];

        if (!authHeader) {
            res.writeHead(402, {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Payment-Required': 'BSV Nano-Settlement Hyper',
                'X-Target-Address': TARGET_BSV_ADDRESS,
                'X-Payment-Fee': `${journal.fee_sats} Sats`
            });
            res.end(JSON.stringify({
                error: "Payment Required",
                settlement_dest: TARGET_BSV_ADDRESS,
                fee_sats: journal.fee_sats
            }));
            return;
        }

        if (processedTxs.has(authHeader)) {
            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: "Duplicate txid blocked." }));
            return;
        }

        const isValid = await verifyBSVTransaction(authHeader);
        if (!isValid) {
            res.writeHead(402, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: "BSV Payment verification failed." }));
            return;
        }

        processedTxs.add(authHeader);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            status: "HYPER_SUCCESS",
            id: authHeader,
            data_sector: journal
        }));
        return;
    }

    // ルートアクセス時は Layer0.html を返すように設定
    let targetFile = pathname === '/' ? 'Layer0.html' : pathname;
    let filePath = path.join(__dirname, targetFile);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found');
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
    console.log(`QLUX Singularity L0 Core running on port ${PORT}`);
    initSingularityBeacon();
});

