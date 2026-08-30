const fs = require('fs');

try {
    let htmlPath = 'blog.html';
    if (!fs.existsSync(htmlPath)) {
        fs.writeFileSync(htmlPath, '<div id="live-container"></div>', 'utf8');
    }

    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const targetMarker = '<div id="live-container">';

    if (!htmlContent.includes(targetMarker)) {
        htmlContent += '\n<div id="live-container"></div>\n';
    }

    const now = Date.now();
    const tags = ["AUTONOMOUS CORE", "QUANTUM MESH", "SOVEREIGN NODE", "CYBER DYNAMICS", "NEURAL STREAM"];
    const titles = [
        "分散型プロトコルがもたらす究極の経済的主権",
        "自律型AIエージェント群によるクラウド要塞の構築",
        "リアルタイムナノ決済が切り拓く新しい富の循環",
        "暗号学的証明ネットワークの完全自動化オペレーション",
        "エッジデバイス艦隊が結ぶ地球規模の同期プロトコル"
    ];
    const bodies = [
        "従来の既製品システムに依存する必要はもはやありません。ポケットの中の端末から放たれるコマンドが、地球規模のインフラをダイレクトに駆動させます。",
        "システムは静寂の中で24時間365日止まることなく稼働し続け、あらゆるプロセスを自己最適化しています。",
        "分散されたノード同士がミリ秒単位で同期し、無数のトランザクションとデータストリームを生成し続けています。",
        "中間マージンや理不尽な制約から完全に解放された空間で、新しい価値の創造は今日も加速し続けています。"
    ];

    // 新しい記事を1件生成
    const idx = now % titles.length;
    const tag = tags[now % tags.length];
    const title = titles[idx];
    const body = bodies[now % bodies.length];
    const dateStr = new Date(now).toISOString().replace('T', ' ').substring(0, 19) + " UTC";

    const newCard = `            <div class="story-card">
                <div class="story-date">${tag} // ${dateStr} // DYNAMIC STREAM #${now}</div>
                <div class="story-title">${title}</div>
                <p class="story-paragraph">${body}</p>
                <div class="story-quote">「コードこそがこの世界の絶対的な法律である。」</div>
            </div>`;

    // 既存のHTMLからすべての story-card を正規表現で抽出し、配列として保持
    const cardRegex = /<div class="story-card">[\s\S]*?<\/div>\s*<\/div>/g;
    let existingCards = htmlContent.match(cardRegex) || [];

    // 新しいカードを先頭に追加
    existingCards.unshift(newCard);

    // 最大件数（ここでは最新10件）に制限し、古いものを自動で切り捨てる
    const maxCards = 10;
    if (existingCards.length > maxCards) {
        existingCards = existingCards.slice(0, maxCards);
    }

    // マーカー以降を新しいカード群で完全に再構築
    const parts = htmlContent.split(targetMarker);
    const updatedHtml = parts[0] + targetMarker + "\n" + existingCards.join("\n") + "\n";

    fs.writeFileSync(htmlPath, updatedHtml, 'utf8');
    console.log("Max 10 stream limit applied successfully.");
} catch (e) {
    console.log("Error:", e);
}
