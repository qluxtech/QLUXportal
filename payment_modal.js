/**
 * QLUX Journal Modal & HTTP 402 Payment Trigger Handler
 * 記事カードのクリックおよび「Pay & Unlock」ボタンに連動して
 * ナノペイメント確認ポップアップを表示し、決済成功後にコンテンツをアンロックする。
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. モック用のポップアップモーダルを動的生成してDOMに追加
  const modalHTML = `
    <div id="qlux-modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; justify-content:center; align-items:center;">
      <div style="background:#0b131a; border:1px solid #10b981; padding:30px; border-radius:12px; width:90%; max-width:450px; color:#fff; font-family:monospace; box-shadow:0 0 20px rgba(16,185,129,0.3);">
        <h3 style="margin-top:0; color:#10b981;">// HTTP 402 GATEWAY ACCESS</h3>
        <p id="qlux-modal-text" style="font-size:14px; color:#9ca3af; line-height:1.6;">この記事の全データおよびAI推論ログにアクセスするには、ナノペイメント（サトシ）の即時清算が必要です。</p>
        <div style="background:#111827; padding:12px; border-radius:6px; margin:15px 0; display:flex; justify-content:between; align-items:center;">
          <span>Required Fee:</span>
          <strong id="qlux-modal-fee" style="color:#10b981;">10 Sats</strong>
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
  const modalText = document.getElementById('qlux-modal-text');
  
  let currentUnlockCallback = null;

  // 2. 記事カードや「Pay & Unlock」ボタンのクリックイベントをバインド
  const unlockTriggers = document.querySelectorAll('.journal-card, [id*="pay"], button');
  
  unlockTriggers.forEach(el => {
    // 既存のフォーム送信などを邪魔しないようボタンやカードを対象にする
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      // ポップアップを表示して決済確認へ移行
      overlay.style.display = 'flex';
      
      currentUnlockCallback = () => {
        overlay.style.display = 'none';
        alert('🎉 Payment Settled! Content Unlocked Successfully.');
        // ここで実際のコンテンツ展開処理を記述
      };
    });
  });

  // 3. 決済ボタンの挙動
  payBtn.addEventListener('click', () => {
    const fee = 10; // デフォルト決済フィー
    if (window.qluxClient) {
      window.qluxClient.payContentAccess(fee, (success) => {
        if (success) {
          if (currentUnlockCallback) currentUnlockCallback();
        } else {
          alert('❌ Insufficient balance. Allow background solver to mine more Sats.');
        }
      });
    } else {
      // クライアントが未定義の場合のフォールバック
      if (currentUnlockCallback) currentUnlockCallback();
    }
  });

  // 4. 閉じるボタンの挙動
  closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
  });
});
