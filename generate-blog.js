const fs = require('fs');

try {
    let htmlPath = 'blog.html';
    if (!fs.existsSync(htmlPath)) {
        console.error("blog.html not found");
        process.exit(1);
    }

    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const targetMarker = '<div id="live-container">';

    if (!htmlContent.includes(targetMarker)) {
        console.error("Target marker not found");
        process.exit(1);
    }

    const now = Date.now();
    const tags = ["AUTONOMOUS CORE", "QUANTUM MESH", "SOVEREIGN NODE", "CYBER DYNAMICS"];
    const titles = [
        "分散型プロトコルがもたらす究極の経済的主権",
        "自律型AIエージェント群によるクラウド要塞の構築",
        "リアルタイムナノ決済が切り拓く新しい富の循環",
        "暗号学的証明ネットワークの完全自動化オペレーション"
    ];
    const bodies = [
        "従来の既製品システムに依存する必要はもはやありません。ポケットの中の端末から放たれるコマンドが、地球規模のインフラを駆動させます。",
        "システムは静寂の中で24時間365日止まることなく稼働し続け、あらゆるプロセスを自己最適化しています。",
        "分散されたノード同士がミリ秒単位で同期し、無数のトランザクションとデータストリームを生成し続けています。"
    ];

    let burstHtml = "";
    for (let i = 0; i < 3; i++) {
        const idx = (now + i) % titles.length;
        const tag = tags[(now + i) % tags.length];
        const title = titles[idx];
        const body = bodies[(now + i) % bodies.length];
        const dateStr = new Date(now - (i * 1000)).toISOString().replace('T', ' ').substring(0, 19) + " UTC";

        burstHtml += `            <div class="story-card">
                <div class="story-date">${tag} // ${dateStr} // STREAM #${now + i}</div>
                <div class="story-title">${title}</div>
                <p class="story-paragraph">${body}</p>
                <div class="story-quote">「コードこそがこの世界の絶対的な法律である。」</div>
            </div>\n`;
    }

    htmlContent = htmlContent.replace(targetMarker, `${targetMarker}\n${burstHtml}`);
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log("Success");
} catch (e) {
    console.error("Error:", e);
    process.exit(1);
}
