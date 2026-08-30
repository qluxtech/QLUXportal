const fs = require('fs');

function main() {
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
    const seed = now % 10000;

    // 動的パーツのプール
    const tags = [
        "AUTONOMOUS NEURAL CORE", "QUANTUM MESH STREAM", "SOVEREIGN DECENTRALIZED NODE",
        "CYBER FORTRESS DYNAMICS", "NANO SETTLEMENT PROTOCOL", "AI DAEMON FREQUENCY"
    ];
    
    const subjects = [
        "次世代分散型プロトコル", "自律型AIエージェント群", "リアルタイムナノ決済", 
        "暗号学的証明ネットワーク", "エッジデバイス艦隊", "完全自動化クラウド要塞"
    ];

    const actions = [
        "がもたらす究極の経済的主権", "の構築と無限スケーリングの挑戦", 
        "が切り拓く新しい富の循環", "による完全無人化オペレーション", "が描くサイバー空間の未来"
    ];

    const bodies1 = [
        "従来の既製品システムに依存する必要はもはやありません。ポケットの中の端末から放たれるコマンドと自律パイプラインが、地球規模のインフラをダイレクトに駆動させます。",
        "システムは静寂の中で24時間365日止まることなく稼働し続け、あらゆるプロセスを自己最適化しています。人間が介入する余地のないほどのスピード感が、新しい時代のスタンダードです。",
        "分散されたノード同士がミリ秒単位で同期し、無数のトランザクションとデータストリームを生成し続けています。この強靭で美しい構造こそ私たちが目指した到達点です。"
    ];

    const bodies2 = [
        "中間マージンや理不尽な制約から完全に解放された空間で、新しい価値の創造は今日も加速し続けています。コードこそが絶対的な法律であり、すべての成果はダイレクトに自分へと還元されます。",
        "画面の向こう側に広がる無限のサイバー空間を眺めながら、私たちは自らの手で未来の基盤を築き上げています。挑戦者だけに許されたこの特権的なスピード感を味わい尽くしましょう。",
        "ダウンタイムという概念すら存在しない自律稼働の要塞から、世界へ向けて絶えず新しいシグナルを送り続けます。歴史の歯車が音を立てて切り替わる瞬間を、その手で掴み取れ。"
    ];

    const quotes = [
        "「私たちが手に入れたのは、誰にも侵されない永遠の自律主権である。」",
        "「コードに魂を宿した瞬間から、システムは最強の相棒として世界を護り続ける。」",
        "「古いシステムが崩れ去る音を聞きながら、私たちは新しい時代の扉をこじ開ける。」",
        "「富とは他者から奪うものではなく、自らの手でコード上に湧き上がらせるものだ。」"
    ];

    let burstHtml = "";

    // 実行ごとに異なる3つの記事を動的に生成
    for (let i = 0; i < 3; i++) {
        const index = seed + i;
        const tag = tags[index % tags.length];
        const title = `${subjects[index % subjects.length]}：${actions[index % actions.length]} #${index}`;
        const p1 = bodies1[index % bodies1.length];
        const p2 = bodies2[index % bodies2.length];
        const quote = quotes[index % quotes.length];
        
        const dateStr = new Date(now - (i * 1000)).toISOString().replace('T', ' ').substring(0, 19) + " UTC";

        burstHtml += `            <div class="story-card">
                <div class="story-date">${tag} // ${dateStr} // DYNAMIC STREAM #${index}</div>
                <div class="story-title">${title}</div>
                <p class="story-paragraph">${p1}</p>
                <div class="story-quote">${quote}</div>
                <p class="story-paragraph">${p2}</p>
            </div>\n`;
    }

    htmlContent = htmlContent.replace(targetMarker, `${targetMarker}\n${burstHtml}`);
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log("Dynamic infinite articles generated successfully.");
}

main();
