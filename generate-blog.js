const fs = require('fs');

// 固定の文章プールではなく、無限の組み合わせを生み出す「文脈シード（原子パーツ）」
const actors = [
    "自律分散型のAIエージェントたち", "名もなき暗号通貨のギークたち", "世界を裏で支えるソブリン・ノード", 
    "中央集権の要塞を包囲するハッカー集団", "量子もつれネットワークの開拓者たち", "次世代モビリティのフリート群"
];

const actions = [
    "仲介者のサーバー群を光速でバイパスし", "理不尽なプラットフォーム手数料の搾取を完全に無効化し", 
    "ミリ秒単位のメッシュ同期によって物理的制約を粉砕し", "すべてのスマートコントラクトを自律的に書き換え", 
    "ナノセトルトメントの光速決済網を世界中に張巡らせ"
];

const outcomes = [
    "誰の許可もいらない永遠の富の循環を現実のものとした。", 
    "個人の主権と真の自由がウォレットに直接着弾する新時代を切り拓いた。", 
    "中央銀行の呪縛から完全に解放された黄金のエコシステムを完成させた。", 
    "エージェントたちが眠ることなく価値を産み出し続ける自律経済圏を確立した。"
];

const quotesPool = [
    "「私たちが手に入れたのは、誰にも没収されることのない永遠の主権である。」",
    "「1秒間に何百万回ものトランザクションが、一銭の搾取もなく仲間たちの元へ流れ続ける。」",
    "「境界線は地図の上だけに存在する。コードを叩く者に限界など最初からなかった。」",
    "「古い世界が崩れ去る音を聞きながら、私たちは新しいフロンティアの扉をこじ開ける。」"
];

const techDetails = [
    "HTTP 402プロトコルのネイティブ実装とストリーム暗号化レイヤーが、APIコール単位でのマイクロ決済を完全に自動化しています。",
    "分散型データベースと自己修復オートノミクス・グリッドにより、システム全体が意思を持っているかのように常に最適化を続けています。",
    "Q-Veloフリートからリアルタイムで吸い上げられる環境・位置データが、ミリ秒の遅延もなくメッシュ空間全体に同期されています。"
];

function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// 完全に毎回異なる文章を数学的・確率的に完全合成
const title = `${rand(actors)}が${rand(actions)}、${rand(outcomes)}`;
const quote = rand(quotesPool);
const body1 = `深夜の静寂に包まれたコンソールルーム。${rand(techDetails)} 画面の向こう側では、世界中のノードから送られてくる富のストリームが、途切れることなくあなたのウォレットを潤し続けています。`;
const body2 = `「もう誰にも指図はされない。」その確信を胸に、私たちは今日も新しいコードを世界へデプロイします。${rand(outcomes)} 終わりのない大冒険の幕が、今まさに上がりました。`;

const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19 + Math.random()) + ' UTC';

const newCardHtml = `
            <div class="story-card">
                <div class="story-date">INFINITE SYNTHESIS // ${nowTime} // QLUX CORE</div>
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
    console.log("Successfully generated a 100% unique synthetic article!");
}
