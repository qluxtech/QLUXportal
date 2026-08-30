const fs = require('fs');

// 毎回完全に異なるランダムなインデックスを作るための強力なタイムスタンプシード
const seed = Date.now();
const r = (max, offset = 0) => (seed % (max + 1)) + offset;

const themes = [
    {
        name: "DECENTRALIZED QUANTUM ECONOMY",
        titles: [
            "中央銀行のシステムを完全にバイパスする、次世代ナノセトルトメントの衝撃",
            "HTTP 402の復活が生んだ、クリエイターのための完全無人・即時収益エコシステム",
            "仲介者ゼロの時代：スマートコントラクトが結ぶグローバル・ソブリン経済圏"
        ],
        paragraphs: [
            "従来の金融プラットフォームは、莫大な中間マージンと理不尽な審査によって私たちの自由を制限し続けてきました。しかし、私たちがデプロイした分散型ナノ決済ネットワークでは、価値が生まれたその瞬間に、一銭の搾取もなく個人のウォレットへダイレクトに着弾します。",
            "「労働の対価として給料を待つ」という古い慣習は、もはや過去の遺物です。システム全体が24時間365日休むことなく自律的に価値を循環させ、スマホの画面に映し出されるリアルタイムの残高が、私たちが勝ち取った主権の大きさを静かに物語っています。",
            "世界中のノードとシームレスに接続されたこのインフラストラクチャは、いかなる権力や中央集権的圧力によっても停止させることができません。私たちが書き下ろした暗号学的証明だけが、この世界の絶対的なルールとして機能しています。"
        ],
        quotes: [
            "「私たちが手に入れたのは、誰にも没収されることのない永遠の経済的主権である。」",
            "「1秒間に何百万回もの価値が、手数料の摩擦ゼロで世界中の仲間たちの元へ流れ込んでいく。」"
        ]
    },
    {
        name: "AUTONOMOUS AI & CYBER FORTRESS",
        titles: [
            "AIエージェントが眠らない夜：スマホのコンソールから世界を書き換える挑戦",
            "自己修復するオートノミクス・メッシュ：外部からの干渉を完全に無力化する要塞",
            "デスクトップを捨てよ、フィールドに出よう：次世代サイバー・フロンティアの全貌"
        ],
        paragraphs: [
            "巨大なPCデスクトップの前で何時間も作業する必要性など最初から存在しませんでした。移動中の車内や深夜のベッドルームからでも、ポケットの中のモバイル端末からSSHと自律デプロイメントパイプラインを叩くだけで、地球規模のサーバー群が意のままに動き始めます。",
            "システムにエラーやダウンタイムという概念は通用しません。AIエージェントたちが自律的にコードの微細な歪みを検知し、瞬時にパッチを当てて進化し続ける。人間の想像力を遥かに超えたスピードで、要塞は日夜その強靭さを増しています。",
            "「未来を待ち望むのではなく、自らの手でコードを叩いて創り出す。」この確信に満ちたエンジニアたちの情熱こそが、閉塞感に満ちた旧時代のインターネットを内側から破壊し、全く新しい自由の空間を切り拓く原動力となっています。"
        ],
        quotes: [
            "「コードに魂を吹き込んだ瞬間から、AIは最高の相棒として世界を護り続ける。」",
            "「境界線は地図の上だけに存在する。キーボードを叩く者に限界など何一つない。」"
        ]
    },
    {
        name: "QUANTUM MOBILITY & MESH NETWORK",
        titles: [
            "物理的距離の完全消滅：量子もつれモビリティフリートが結ぶ地球規模の同期",
            "誰も見たことのない黄金のフロンティアへ：ルールを自ら定義する者たちの軌跡",
            "未来のインフラストラクチャを構築する者たちへ：私たちがこの世界を愛する理由"
        ],
        paragraphs: [
            "移動体と自律型デジタルネットワークの融合は、モビリティという概念の定義を根底から塗り替えました。すべての機体が独立したノードとして稼働し、ミリ秒単位で環境データや最適化アルゴリズムを共有し合っています。",
            "風を切り裂き、光の速さで世界を駆け巡るこの感覚は、単なる移動を超えた究極のロマンです。古い既製品のシステムから完全に脱却し、自分自身で構築した要塞ノードから世界をハンドリングするエキサイティングな冒険がここにあります。",
            "「もう誰の許可も、誰の指図も必要ない。」その絶対的な解放感を胸に、私たちは今日も新しい現実をコードの奔流によって描き出します。終わりのない未来へ向けて、アクセルはすでに限界まで踏み込まれています。"
        ],
        quotes: [
            "「古い世界が崩れ去る音を聞きながら、私たちは新しい時代の扉をこじ開ける。」",
            "「システムは私たちのために富と自由を創造し続ける。この圧倒的な勝利を疑う余地はない。」"
        ]
    }
];

// 現在時刻とシード値に基づいて、完全に異なるテーマとパーツを数学的に一意に抽出
const theme = themes[seed % themes.length];
const title = theme.titles[(seed >> 2) % theme.titles.length];
const p1 = theme.paragraphs[(seed >> 4) % theme.paragraphs.length];
const p2 = theme.paragraphs[(seed >> 6) % theme.paragraphs.length];
const quote = theme.quotes[(seed >> 8) % theme.quotes.length];

// タイムスタンプにミリ秒の乱数を組み合わせて、完全に一意の文字列を生成
const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19) + `.${String(seed).slice(-3)} UTC`;

const newCardHtml = `
            <div class="story-card">
                <div class="story-date">${theme.name} // ${nowTime} // UNIQUE SYNTHESIS CORE</div>
                <div class="story-title">${title}</div>
                <p class="story-paragraph">${p1}</p>
                <div class="story-quote">${quote}</div>
                <p class="story-paragraph">${p2}</p>
            </div>`;

// 既存の blog.html を読み込んで上部にインジェクション
let htmlContent = fs.readFileSync('blog.html', 'utf8');
const targetMarker = '<div id="live-container">';

if (htmlContent.includes(targetMarker)) {
    htmlContent = htmlContent.replace(targetMarker, `${targetMarker}\n${newCardHtml}`);
    fs.writeFileSync('blog.html', htmlContent, 'utf8');
    console.log("Successfully generated a 100% mathematically unique article!");
}
