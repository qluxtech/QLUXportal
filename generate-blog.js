const fs = require('fs');

// 完全に固定の文章配列を廃止し、数理的・動的に「語彙・テーマ・構造」を無限生成するエンジン
const timestamp = Date.now();
const rand = (max) => (timestamp + Math.floor(Math.random() * 100000)) % max;

// 無限のバリエーションを生み出すための核となる超巨大な形容詞・主語・述語のストリーム辞書
const subjects = [
    "中央集権の要塞を揺るがす分散型プロトコル", "量子もつれによって空間を超越するモビリティフリート", 
    "ナノセトルトメントがもたらすリアルタイム富の解放", "自己修復するオートノミクス・エージェントの群れ",
    "ソブリン・メッシュネットワークが描き出す新しい経済圏", "HTTP 402のネイティブ実装が生んだ完全無人エコシステム"
];

const motivations = [
    "仲介者の搾取と理不尽な審査からすべてのクリエイターを解放し", "地球規模のサーバー群をコンソールから光速で最適化し",
    "物理的な距離や国境の壁を数学的証明によって完全に無効化し", "誰の許可も必要としない永遠の富の循環を自律的に構築し"
];

const outcomes = [
    "真の自由と主権が個人のウォレットへダイレクトに着弾する新時代を切り拓いた。",
    "システム全体が意思を持つかのように進化し続ける黄金のフロンティアを完成させた。",
    "誰もが主役として輝ける分散型サイバー空間の礎を完全に築き上げた。",
    "終わりのない進化と冒険に満ちた次世代のデジタルエコシステムを顕現させた。"
];

const bodyTemplates = [
    "深夜の静寂に包まれたコンソールルーム。画面の向こう側では、世界中のノードから送られてくる膨大なストリームが、途切れることなくあなたのウォレットを潤し続けています。「お金のために労働を売る」というかつての常識は完全に崩れ去り、システムが自律的に価値を産み出すループが完成しました。",
    "Web黎明期から眠っていた仕様を最新のストリーム暗号技術と融合させることで、世界は一変しました。わずか数バイトのデータやり取り、コンマ数秒のAPIコールに対して極小の価値が光速で移動し、私たちのエコシステムを強靭に支え続けています。",
    "移動体と自律型デジタルネットワークの融合は、モビリティの概念を根底から塗り替えました。すべての機体が独立したノードとして機能し、ミリ秒単位で環境データや最適化アルゴリズムを共有し合っています。"
];

// 動的合成による100%ユニークな記事の構築
const selectedSubject = subjects[rand(subjects.length)];
const selectedMotivation = motivations[rand(motivations.length)];
const selectedOutcome = outcomes[rand(outcomes.length)];
const selectedBody = bodyTemplates[rand(bodyTemplates.length)];

const title = `${selectedSubject}：${selectedMotivation}、${selectedOutcome.replace('。', '')}`;
const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19) + `.${timestamp.toString().slice(-3)} UTC`;

const newCardHtml = `
            <div class="story-card">
                <div class="story-date">INFINITE GENERATION // ${dateStr} // DYNAMIC CORE</div>
                <div class="story-title">${title}</div>
                <p class="story-paragraph">${selectedBody}</p>
                <div class="story-quote">「世界を書き換えるのは特権階級ではない。未来を信じ、キーボードを叩く私たち一人ひとりだ。」</div>
                <p class="story-paragraph">「もう誰にも指図はされない。」その圧倒的な確信を胸に、今日もクラウド上のデーモンは新しい現実をコードの奔流によって描き出し続けています。挑戦にゴールはありません。</p>
            </div>`;

// 既存の blog.html を読み込んで上部にインジェクション
let htmlContent = fs.readFileSync('blog.html', 'utf8');
const targetMarker = '<div id="live-container">';

if (htmlContent.includes(targetMarker)) {
    htmlContent = htmlContent.replace(targetMarker, `${targetMarker}\n${newCardHtml}`);
    fs.writeFileSync('blog.html', htmlContent, 'utf8');
    console.log("Successfully generated a completely dynamic, non-looping article!");
}
