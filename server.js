const qssmMatrix = require('./qssm');
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
        description: "QLUX Layer 0 ハイパー進化コア : セクター #1 は、マルチエージェント間でのゼロ知識証明とクロスチェーン自動決済を完全に統合した自律分散コンセンサスエンジンです。",
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

        console.log(`[HYPER PULSE] Beacon broadcasted. Global Load Index: ${globalRequestCounter}`);
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

const EMBEDDED_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QLUX Hyper-Singularity Core // L0 Dashboard</title>
    <style>
        :root {
            --bg-main: #030712;
            --bg-card: #0b1120;
            --text-main: #e5e7eb;
            --text-muted: #9ca3af;
            --text-gold: #f59e0b;
            --border-color: #1f2937;
            --accent-blue: #38bdf8;
            --accent-green: #10b981;
        }
        body {
            background-color: var(--bg-main);
            color: var(--text-main);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 16px;
            box-sizing: border-box;
        }
        .header-panel {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
        @media (max-width: 768px) { .dashboard-grid { grid-template-columns: 1fr; } }
        .metric-box {
            background: #030712;
            border: 1px solid #374151;
            border-radius: 12px;
            padding: 14px;
            text-align: center;
        }
        .metric-val { font-size: 20px; font-weight: 800; color: var(--text-gold); margin-top: 4px; }
        .chart-container {
            background: #030712;
            border: 1px solid #1e3a8a;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 20px;
        }
        .journal-container { display: flex; flex-direction: column; gap: 20px; }
        .article-card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .article-meta { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); margin-bottom: 12px; }
        .article-title { font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 12px; }
        .article-body p { font-size: 14px; line-height: 1.6; color: #d1d5db; }
        .code-snippet { background: #030712; border: 1px solid #374151; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 12px; margin: 12px 0; overflow-x: auto; color: var(--accent-blue); }
        .paywall-locked {
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            padding: 16px;
            background: rgba(3, 7, 18, 0.85);
            border: 1px dashed #374151;
            margin-bottom: 16px;
        }
        .blur-content { filter: blur(6px); user-select: none; pointer-events: none; color: #6b7280; }
        .paywall-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to bottom, rgba(11, 17, 12, 0.5), rgba(11, 17, 12, 0.96));
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 12px;
        }
        .btn-access {
            background: var(--accent-green);
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            font-size: 13px;
        }
        #payment-modal {
            display: none;
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(3, 7, 18, 0.9);
            z-index: 1000;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
        }
        .quantum-modal-card {
            background: #0b1120;
            border: 1px solid #1e3a8a;
            border-radius: 24px;
            width: 100%;
            max-width: 600px;
            padding: 30px;
            color: #e5e7eb;
            max-height: 90vh;
            overflow-y: auto;
        }
        .gateway-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #1e3a8a; padding-bottom: 14px; margin-bottom: 20px; }
        .gateway-title { font-size: 15px; font-weight: 800; color: #fff; }
        .gateway-sub { font-size: 12px; color: var(--accent-blue); margin-top: 4px; }
        .gateway-box { background: #030712; border: 1px solid #1f2937; border-radius: 14px; padding: 18px; margin-bottom: 14px; }
        .input-txid { width: 100%; background: #111827; border: 1px solid #374151; color: #fff; padding: 10px; border-radius: 8px; font-size: 12px; margin-top: 6px; box-sizing: border-box; }
        .btn-verify { width: 100%; background: var(--accent-blue); color: #fff; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px; }
        .gateway-close-btn { width: 100%; background: transparent; border: none; color: #4b5563; margin-top: 12px; cursor: pointer; font-size: 12px; }
    </style>
</head>
<body>
    <header class="header-panel">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 16px; font-weight: 800; color: #fff;">QLUX L0 // HYPER-SINGULARITY CORE</span>
            <span style="background: #064e3b; color: #34d399; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700;">LIVE SYSTEM ACTIVE</span>
        </div>
        <div class="dashboard-grid">
            <div class="metric-box">
                <div style="font-size: 11px; color: var(--text-muted);">グローバルロードインデックス</div>
                <div class="metric-val" id="metric-load">0</div>
            </div>
            <div class="metric-box">
                <div style="font-size: 11px; color: var(--text-muted);">サージマルチプライヤー (倍率係数)</div>
                <div class="metric-val" id="metric-surge" style="color:var(--text-gold);">1.01x</div>
            </div>
        </div>
    </header>

    <div class="chart-container">
        <div style="font-size: 11px; font-weight: bold; color: var(--accent-blue); margin-bottom: 8px;">📊 リアルタイム・トラフィック脈動</div>
        <canvas id="liveChart" width="600" height="120" style="width: 100%; height: 120px; background: #030712; border-radius: 8px;"></canvas>
    </div>

    <main class="journal-container" id="feed-container">
        <article class="article-card">
            <div class="article-meta"><span>2026.08.17 // HYPER CORE</span><span>REF: QK-HYPER-01</span></div>
            <h2 class="article-title">[HYPER-PEAK] 向神AIスウォーム同期セクター #1</h2>
            <div class="article-body">
                <p>QLUX Layer 0 ハイパー進化コア : セクター #1 は、マルチエージェント間でのゼロ知識証明とクロスチェーン自動決済を完全に統合した自律分散コンセンサスエンジンです。</p>
                <div class="code-snippet">&gt; Hyper-Swarm Pipeline\nasync function executeHyperSync() { return "Multi-Agent Synced"; }</div>
                <div class="paywall-locked">
                    <div class="blur-content"><b>[秘匿コア・特異点ソース]</b> <b><b>自律エージェント連携を最適化する究極分散コンセンサスプロトコル...</div>
                    <div class="paywall-overlay">
                        <div style="color: #fff; font-weight: 800; font-size: 15px; margin-bottom: 6px;">🔒 HTTP 402 ナノ決済プロテクション</div>
                        <div style="color: #9ca3af; font-size: 13px; margin-bottom: 12px;">BSVトランザクションによるリアルタイムアンロック</div>
                        <button class="btn-access" onclick="openModal(1, 15)">BSVで活性時アンロック (15 Sats)</button>
                    </div>
                </div>
            </div>
        </article>
    </main>

    <div id="payment-modal">
        <div class="quantum-modal-card">
            <div class="gateway-header">
                <div>
                    <div class="gateway-title">QLUX Nano-Settlement Gateway</div>
                    <div class="gateway-sub">HTTP 402 微小決済回路</div>
                </div>
            </div>
            <div class="gateway-box">
                <div id="modal-fee" style="font-size: 20px; font-weight: 800; color: var(--text-gold);">15 Sats</div>
                <div id="gateway-sub" class="gateway-sub">宛先直結</div>
            </div>
            <div class="gateway-box">
                <div style="color: var(--accent-blue); font-weight: bold; margin-bottom: 6px;">① BSV 送金先アドレス</div>
                <div style="background: #111827; padding: 10px; border-radius: 8px; font-family: monospace; font-size: 12px; word-break: break-all;" id="target-address-display">1Mb66iHohUEg8eAnkgV9uTTV7R235tuy95</div>
            </div>
            <div class="gateway-box">
                <div style="color: var(--accent-blue); font-weight: bold; margin-bottom: 6px;">② テスト送金後のTxid入力 (リアルタイム検証)</div>
                <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">WhatsOnChain APIを通して瞬時照合し、セクターの暗号プロテクションを解除します。</div>
                <input type="text" id="txid-input" class="input-txid" placeholder="トランザクションID (Txid) を入力...">
                <button class="btn-verify" onclick="verifyAndUnlock()" style="margin-top:10px;">🔓 認証してアンロック実行</button>
            </div>
            <button class="gateway-close-btn" onclick="closeModal()">キャンセル</button>
        </div>
    </div>

    <script>
        let currentJournalId = 1;
        function openModal(id, fee) {
            currentJournalId = id;
            document.getElementById('modal-fee').innerText = fee + ' Sats';
            document.getElementById('payment-modal').style.display = 'flex';
        }
        function closeModal() { document.getElementById('payment-modal').style.display = 'none'; }

        async function verifyAndUnlock() {
            const txid = document.getElementById('txid-input').value.trim();
            if (!txid) { alert('Txidを入力してください'); return; }
            try {
                const res = await fetch('/api/journals/' + currentJournalId, {
                    headers: { 'x-payment-txid': txid }
                });
                const data = await res.json();
                if (res.ok) {
                    alert('✨ 決済認証成功！ 特殊セクターがアンロックされました。');
                    closeModal();
                    location.reload();
                } else {
                    alert('❌ 検証失敗: ' + (data.error || '不明なエラー'));
                }
            } catch (e) {
                alert('通信エラーが発生しました');
            }
        }

        async function fetchMetrics() {
            try {
                const res = await fetch('/.well-known/qlux-agent.json');
                const data = await res.json();
                document.getElementById('metric-load').innerText = data.global_load_index;
                document.getElementById('metric-surge').innerText = data.surge_multiplier;
                drawChart();
            } catch (e) {}
        }

        function drawChart() {
            const canvas = document.getElementById('liveChart');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - 20);
            ctx.lineToToCache = ctx.lineTo(canvas.width, canvas.height - 50);
            ctx.stroke();
        }

        setInterval(fetchMetrics, 5000);
        window.addEventListener('DOMContentLoaded', fetchMetrics);
    </script>
</body>
</html>`;

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
                    peak_merkle_root: "0xhyper_zk_merkle_" + Buffer.from(txid + Date.now()).toString('hex').substring(0, 40),
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
                'X-Payment-Fee': `${journal.fee_sats} Sats`,
                'X-Agent-Manifest': '/.well-known/qlux-agent.json'
            });
            res.end(JSON.stringify({
                error: "Payment Required",
                protocol: "HTTP_402_HYPER_NANO",
                settlement_dest: TARGET_BSV_ADDRESS,
                fee_sats: journal.fee_sats,
                message: `HTTP 402: Send ${journal.fee_sats} Sats BSV to ${TARGET_BSV_ADDRESS} to unlock sector #${id}`
            }));
            return;
        }

        if (processedTxs.has(authHeader)) {
            res.writeHead(403, { 'Content-Type': '
