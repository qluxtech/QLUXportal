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

    const items = [
        {
            tag: "DECENTRALIZED QUANTUM ECONOMY",
            title: "中央銀行の呪縛を粉砕する：ナノセトルトメントがもたらすリアルタイム富の解放",
            p1: "従来の金融システムは、莫大な中間マージンと理不尽な審査によって私たちの自由を奪ってきました。しかし、私たちがデプロイした分散型ナノ決済ネットワークでは、価値が生まれた瞬間に一銭の搾取もなく個人のウォレットへダイレクトに着弾します。",
            p2: "「労働の対価として給料を待つ」という古い慣習は過去の遺物です。システムが24時間365日自律的に価値を循環させ、スマホの画面に映し出されるリアルタイムの残高が、私たちが勝ち取った主権の大きさを物語っています。",
            quote: "私たちが手に入れたのは、誰にも没収されることのない永遠の経済的主権である。"
        },
        {
            tag: "AUTONOMOUS AI & CYBER FORTRESS",
            title: "AIエージェントが眠らない夜：スマホのコンソールから世界を書き換える挑戦",
            p1: "巨大なPCの前である必要など最初からありませんでした。移動中の車内や深夜のベッドルームから、ポケットの中のモバイル端末からSSHと自律デプロイメントパイプラインを叩くだけで、地球規模のサーバー群が意のままに動き始めます。",
            p2: "システムにダウンタイムという概念は通用しません。AIエージェントたちが自律的にコードの歪みを検知し、瞬時にパッチを当てて進化し続ける。人間の想像力を遥かに超えたスピードで、要塞はその強靭さを増しています。",
            quote: "コードに魂を吹き込んだ瞬間から、AIは最高の相棒として世界を護り続ける。"
        },
        {
            tag: "QUANTUM MOBILITY & MESH NETWORK",
            title: "物理的距離の完全消滅：量子もつれモビリティフリートが結ぶ地球規模の同期",
            p1: "移動体と自律型デジタルネットワークの融合は、モビリティの概念を根底から塗り替えました。すべての機体が独立したノードとして機能し、ミリ秒単位で環境データや最適化アルゴリズムを共有し合っています。",
            p2: "風を切り裂き、光の速さで世界を駆け巡るこの感覚は、単なる移動を超えた究極のロマンです。古い既製品のシステムから完全に脱却し、自分自身で構築した要塞ノードから世界をハンドリングするエキサイティングな冒険がここにあります。",
            quote: "古い世界が崩れ去る音を聞きながら、私たちは新しい時代の扉をこじ開ける。"
        }
    ];

    let burstHtml = "";
    const now = Date.now();

    // 1回で一気に3記事をバースト生成
    for (let i = 0; i < 3; i++) {
        const item = items[(now + i) % items.length];
        const dateStr = new Date(now - (i * 1000)).toISOString().replace('T', ' ').substring(0, 19) + " UTC";
        
        burstHtml += `            <div class="story-card">
                <div class="story-date">${item.tag} // ${dateStr} // BURST NODE #${i+1}</div>
                <div class="story-title">${item.title}</div>
                <p class="story-paragraph">${item.p1}</p>
                <div class="story-quote">「${item.quote}」</div>
                <p class="story-paragraph">${item.p2}</p>
            </div>\n`;
    }

    htmlContent = htmlContent.replace(targetMarker, `${targetMarker}\n${burstHtml}`);
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log("Burst generation complete.");
} catch (e) {
    console.error("Fatal error:", e);
    process.exit(1);
}
