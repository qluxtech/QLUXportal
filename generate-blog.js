const fs = require('fs');

function main() {
    const timestamp = Date.now();
    const rand = (max) => (timestamp + Math.floor(Math.random() * 99999)) % max;

    const pools = [
        {
            tag: "DECENTRALIZED QUANTUM ECONOMY",
            title: "中央銀行の呪縛を粉砕する：ナノセトルトメントがもたらすリアルタイム富の解放",
            p1: "従来の金融システムは、莫大な中間マージンと理不尽な審査によって私たちの自由を奪ってきました。しかし、私たちがデプロイした分散型ナノ決済ネットワークでは、価値が生まれた瞬間に一銭の搾取もなく個人のウォレットへダイレクトに着弾します。",
            p2: "「労働の対価として給料を待つ」という古い慣習は過去の遺物です。システムが24時間365日自律的に価値を循環させ、スマホの画面に映し出されるリアルタイムの残高が、私たちが勝ち取った主権の大きさを物語っています。",
            quote: "「私たちが手に入れたのは、誰にも没収されることのない永遠の経済的主権である。」"
        },
        {
            tag: "AUTONOMOUS AI & CYBER FORTRESS",
            title: "AIエージェントが眠らない夜：スマホのコンソールから世界を書き換える挑戦",
            p1: "巨大なPCの前である必要など最初からありませんでした。移動中の車内や深夜のベッドルームから、ポケットの中のモバイル端末からSSHと自律デプロイメントパイプラインを叩くだけで、地球規模のサーバー群が意のままに動き始めます。",
            p2: "システムにダウンタイムという概念は通用しません。AIエージェントたちが自律的にコードの歪みを検知し、瞬時にパッチを当てて進化し続ける。人間の想像力を遥かに超えたスピードで、要塞はその強靭さを増しています。",
            quote: "「コードに魂を吹き込んだ瞬間から、AIは最高の相棒として世界を護り続ける。」"
        },
        {
            tag: "QUANTUM MOBILITY & MESH NETWORK",
            title: "物理的距離の完全消滅：量子もつれモビリティフリートが結ぶ地球規模の同期",
            p1: "移動体と自律型デジタルネットワークの融合は、モビリティの概念を根底から塗り替えました。すべての機体が独立したノードとして機能し、ミリ秒単位で環境データや最適化アルゴリズムを共有し合っています。",
            p2: "風を切り裂き、光の速さで世界を駆け巡るこの感覚は、単なる移動を超えた究極のロマンです。古い既製品のシステムから完全に脱却し、自分自身で構築した要塞ノードから世界をハンドリングするエキサイティングな冒険がここにあります。",
            quote: "「古い世界が崩れ去る音を聞きながら、私たちは新しい時代の扉をこじ開ける。」"
        },
        {
            tag: "SOVEREIGN ARCHIVE & NEURAL STREAM",
            title: "秒速100万回のナノセトルメントが切り拓く、人類史上最も美しい富の循環メカニズム",
            p1: "朝、目を覚ましてコンソールを開くと、治球の裏側で稼働するモビリティフリートやエージェントたちからの収益ストリームが、途切れることなくウォレットへ流れ込んでいます。誰の許可もいらず、理不尽な審査に怯えることもない。",
            p2: "私たちが書いたスマートコントラクトと、信頼できる暗号学の証明だけが、この世界のルールです。限界のない自由なサイバー空間で、新しい価値の創造は今日も加速し続けています。",
            quote: "「富とは他者から奪うものではなく、自らの手でコード上に湧き上がらせるものだ。」"
        }
    ];

    // ランダムに新しい記事を選択
    const item = pools[rand(pools.length)];
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19) + `.${String(timestamp).slice(-3)} UTC`;

    const newCardHtml = `            <div class="story-card">
                <div class="story-date">${item.tag} // ${nowTime} // QLUX ENGINE</div>
                <div class="story-title">${item.title}</div>
                <p class="story-paragraph">${item.p1}</p>
                <div class="story-quote">${item.quote}</div>
                <p class="story-paragraph">${item.p2}</p>
            </div>`;

    let htmlPath = 'blog.html';
    if (!fs.existsSync(htmlPath)) {
        console.error("Error: blog.html does not exist!");
        process.exit(1);
    }

    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const targetMarker = '<div id="live-container">';

    if (htmlContent.includes(targetMarker)) {
        // マーカーの直下に「新しい記事」を追加しつつ、既存のカード（下にあった記事たち）もそのまま残す
        htmlContent = htmlContent.replace(targetMarker, `${targetMarker}\n${newCardHtml}`);
        fs.writeFileSync(htmlPath, htmlContent, 'utf8');
        console.log("Successfully stacked a new unique article into the stream!");
    } else {
        console.error("Error: <div id=\"live-container\"> not found in blog.html");
        process.exit(1);
    }
}

main();
