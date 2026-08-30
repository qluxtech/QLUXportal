const fs = require('fs');

const subjects = [
    "中央集権の要塞", "量子もつれモビリティ", "ナノセトルトメント経済圏", 
    "オートノマス・エージェント", "ソブリン・メッシュネットワーク", "次世代サイバー・フロンティア"
];
const verbs = ["完全破壊し", "光速で超越して", "自律的に最適化し", "完全に掌握して", "華麗にハックして"];
const goals = ["永久不滅の自由を手に入れる大冒険", "誰も見たことがない黄金の未来を切り拓く軌跡", "全人類の主権をウォレットへ取り戻す革命", "終わりなき富の循環を現実にする挑戦"];

const bodiesLib = [
    "朝、目を覚ましてコンソールを開くと、地球の裏側で稼働するモビリティフリートやAIエージェントたちからの収益ストリームが、途切れることなくウォレットへ流れ込んでいます。誰の許可もいらず、理不尽な審査に怯えることもない。私たちが書いたスマートコントラクトと暗号学の証明だけが世界のルールです。",
    "Web黎明期から眠っていた仕様を最新のストリーム暗号技術と融合させることで、世界は一変しました。わずか数バイトのデータやり取り、コンマ数秒のAPIコールに対して、極小の価値が光速で移動し、私たちのエコシステムを強靭に支え続けています。"
];

function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
const newTitle = `${rand(subjects)}を${rand(verbs)}、${rand(goals)}`;
const newBody = rand(bodiesLib);

const newCardHtml = `
            <div class="story-card">
                <div class="story-date">DAEMON AUTONOMOUS ENGINE // ${nowTime} // QLUX CORE</div>
                <div class="story-title">${newTitle}</div>
                <p class="story-paragraph">${newBody}</p>
                <p class="story-paragraph">「世界を書き換えるのは特権階級ではない。未来を信じ、キーボードを叩く私たち一人ひとりだ。」この確信を胸に、クラウド上のデーモンは今日も止まることなく新しい現実を構築し続けます。</p>
            </div>`;

// 既存の blog.html を読み込んで新しい記事を上部にインジェクションする
let htmlContent = fs.readFileSync('blog.html', 'utf8');
const targetMarker = '<div id="live-container">';

if (htmlContent.includes(targetMarker)) {
    htmlContent = htmlContent.replace(targetMarker, `${targetMarker}\n${newCardHtml}`);
    fs.writeFileSync('blog.html', htmlContent, 'utf8');
    console.log("Successfully generated and injected new daemon article!");
}

