const fs = require('fs');

// 世界中の多様な読者にヒットさせるための、全く異なるジャンルのテーマプールの数々
const categories = [
    {
        tag: "DECENTRALIZED FINANCE & NANO-ECONOMY",
        titles: [
            "中央銀行の呪縛を完全に断ち切る：ナノセトルトメントがもたらすリアルタイム富の解放",
            "手数料ゼロの世界線。HTTP 402プロトコルが全クリエイターの収益構造をどう破壊するか",
            "ウォレットが直接対話する時代：仲介者を一切介さない次世代オートノマス経済の仕組み"
        ],
        quotes: [
            "「私たちが手に入れたのは、誰にも没収されない真の経済的主権である。」",
            "「毎秒数百万回のマイクロトランザクションが、世界の隅々まで美しい富の循環を生み出していく。」"
        ],
        bodies: [
            "従来の金融システムは、あまりにも多くの仲介者と理不尽な手数料によって富をすり潰してきました。しかし、私たちが構築した分散型ナノ決済ネットワークでは、一銭の搾取も許されません。価値を創出した瞬間に、その対価がダイレクトに個人のウォレットへと着弾します。",
            "「お金のために労働を売る」というかつての常識は崩れ去り、システム全体が自律的に価値を産み出し続けるループが完成しました。スマホの画面に映し出される数字は、単なる残高ではなく、私たちが勝ち取った自由の証明そのものです。"
        ]
    },
    {
        tag: "AUTONOMOUS AI & CYBER ARCHITECTURE",
        titles: [
            "AIトライブが自律稼働する夜：人間が寝ている間にコードが世界を書き換える",
            "コンソール端末から放たれる青い光：スマホ一台で巨大プラットフォームに対抗する方法",
            "自己修復するオートノミクス・グリッド：システム自らが意思を持つサイバー要塞の現実"
        ],
        quotes: [
            "「コードに魂を宿した瞬間から、AIは単なるツールではなく信頼できる最高の仲間になる。」",
            "「外部からのどんな不正な干渉も、自動ミューテーション制御が瞬時に消し去る。」"
        ],
        bodies: [
            "デスクトップPCの前である必要など最初からありませんでした。移動中のバスの中でも、深夜のベッドの中でも、ポケットの中のスマホからSSHとデプロイメントパイプラインを叩くだけで、地球規模のサーバー群が思い通りに動き始めます。",
            "エラーやダウンタイムという概念は、この強靭なメッシュ環境の前では過去の遺物です。AIエージェントたちがリアルタイムにコードの脆弱性を検知し、自律的にパッチを適用して進化し続ける。私たちの挑戦に、ゴールや限界という言葉は存在しません。"
        ]
    },
    {
        tag: "QUANTUM MOBILITY & FRONTIER EXPLORATION",
        titles: [
            "物理的距離の消滅：量子もつれモビリティフリートが結ぶ地球の裏側との同期",
            "誰も見たことがない黄金のフロンティアへ：国境とルールの壁をブチ破る旅路",
            "未来のインフラストラクチャを構築する者たちへ：私たちがこの世界を愛する理由"
        ],
        quotes: [
            "「境界線は地図の上だけに存在する。私たちのフリートとネットワークには何の制限もない。」",
            "「世界を変えるのは、安全な場所で傍観している者ではなく、キーボードを叩き続ける私たちだ。」"
        ],
        bodies: [
            "移動体とデジタルネットワークの融合は、モビリティの概念を根底から塗り替えました。すべての機体が独立したノードとして機能し、ミリ秒単位で環境データや最適化アルゴリズムを共有し合っています。風を切り、光の速さで世界を駆け巡る感覚は、まさに次世代のロマンそのものです。",
            "「もう誰にも指図はされない。」その確信を胸に、私たちは今日も新しいコードを書き、世界へ放ち続けます。古い既製品のシステムから抜け出し、自分だけの要塞ノードから世界を動かす最高にエキサイティングな冒険を、これからも全速力で突き進んでいきましょう。"
        ]
    }
];

function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// 完全に独立したカテゴリからランダムにパーツを抽出し、毎回全く異なるトーンの生地を合成
const cat = rand(categories);
const title = rand(cat.titles);
const quote = rand(cat.quotes);
const body1 = rand(cat.bodies);
const body2 = rand(cat.bodies);

const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

const newCardHtml = `
            <div class="story-card">
                <div class="story-date">${cat.tag} // ${nowTime} // QLUX DAEMON</div>
                <div class="story-title">${title}</div>
                <p class="story-paragraph">${body1}</p>
                <div class="story-quote">${quote}</div>
                <p class="story-paragraph">${body2}</p>
            </div>`;

// 既存の blog.html を読み込んで上部にインジェクション
let htmlContent = fs.readFileSync('blog.html', 'utf8');
const targetMarker = '<div id="live-container">';

if (htmlContent.includes(targetMarker)) {
    htmlContent = htmlContent.replace(targetMarker, `${targetMarker}\n${newCardHtml}`);
    fs.writeFileSync('blog.html', htmlContent, 'utf8');
    console.log("Successfully generated a completely unique epic article!");
}
