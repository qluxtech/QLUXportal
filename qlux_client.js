/**
 * QLUX Unified Sovereign Client Core (qlux_client.js)
 * バックグラウンド・ソルバーとHTTP 402ナノペイメント決済モーダル機能を
 * 1つのファイルに完全統合したオールインワン・クライアントスクリプト。
 */

class QLUXUnifiedClient {
  constructor() {
    this.nodeId = 'BROWSER_NODE_' + Math.random().toString(36).substr(2, 9);
    this.earnedSats = 150; // 初期保有サトシ
    this.init();
  }

  init() {
    console.log(`[QLUX_CORE] Initialized node ID: ${this.nodeId}`);
    this.startBackgroundMining();
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.injectModalUI());
    } else {
      this.injectModalUI();
    }
  }

  startBackgroundMining() {
    setInterval(() => {
      const reward = Math.floor(Math.random() * 3) + 1;
      this.earnedSats += reward;
      window.dispatchEvent(new CustomEvent('qlux:settlement', {
        detail: { nodeId: this.nodeId, sats: reward, totalEarned: this.earnedSats }
      }));
      console.log(`[QLUX_SOLVER] Mined +${reward} Sats. Balance: ${this.earnedSats} Sats`);
    }, 5000);
  }

  injectModalUI() {
    if (document.getElementById('qlux-modal-overlay')) return;

    const modalHTML = `
      <div id="qlux-modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; justify-content:center; align-items:center; backdrop-filter:blur(5px);">
        <div style="background:#0b131a; border:1px solid #10b981; padding:30px; border-radius:12px; width:90%; max-width:450px; color:#fff; font-family:monospace; box-shadow:0 0 20px rgba(16,185,129,0.3);">
          <h3 style="margin-top:0; color:#10b981;">// HTTP 402 GATEWAY ACCESS</h3>
          <p style="font-size:14px; color:#9ca3af; line-height:1.6;">この記事の全データおよびAI推論ログにアクセスするには、ナノペイメントの即時清算が必要です。</p>
          <div style="background:#111827; padding:12px; border-radius:6px; margin:15px 0; display:flex; justify-content:space-between; align-items:center;">
            <span>Required Fee:</span>
            <strong style="color:#10b981;">10 Sats</strong>
          </div>
          <div style="display:flex; gap:10px; margin-top:20px;">
            <button id="qlux-pay-btn" style="flex:1; background:#10b981; color:#000; border:none; padding:10px; font-weight:bold; border-radius:6px; cursor:pointer;">⚡ Pay & Unlock</button>
            <button id="qlux-close-btn" style="flex:1; background:transparent; border:1px solid #4b5563; color:#9ca3af; padding:10px; border-radius:6px; cursor:pointer;">Cancel</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const overlay = document.getElementById('qlux-modal-overlay');
    const payBtn = document.getElementById('qlux-pay-btn');
    const closeBtn = document.getElementById('qlux-close-btn');

    let activeCallback = null;

    document.addEventListener('click', (e) => {
      const target = e.target.closest('.journal-card, [id*="pay"], button');
      if (target && target.id !== 'qlux-pay-btn' && target.id !== 'qlux-close-btn' && !target.classList.contains('nav-btn')) {
        e.preventDefault();
        overlay.style.display = 'flex';
        activeCallback = () => {
          overlay.style.display = 'none';
          alert('🎉 Payment Settled! Content Unlocked Successfully.');
        };
      }
    });

    payBtn.addEventListener('click', () => {
      const fee = 10;
      if (this.earnedSats >= fee) {
        this.earnedSats -= fee;
        console.log(`[QLUX_GATEWAY] Payment settled. Remaining: ${this.earnedSats} Sats`);
        if (activeCallback) activeCallback();
      } else {
        alert('❌ Insufficient balance. Let background miner run longer.');
      }
    });

    closeBtn.addEventListener('click', () => {
      overlay.style.display = 'none';
    });
  }
}

window.qluxClient = new QLUXUnifiedClient();
