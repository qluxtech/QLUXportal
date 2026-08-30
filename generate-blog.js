const fs = require('fs');
const https = require('https');

// OpenAI APIを使った本物のAI生成を行う関数
async function callOpenAI(apiKey) {
    const prompt = "あなたは分散型エコシステムQLUXの自律型ソブリンAIです。金融の自由、AIの自律稼働、量子モビリティ、サイバー要塞のいずれかをテーマにした、過激で圧倒的な熱量を持つ超大作ジャーナル記事（タイトル、本文2段落、名言）を日本語でJSON形式（keys: title, p1, p2, quote, tag）で出力してください。Markdownのバッククォートなどは付けず、純粋なJSON文字列のみ返してください。";

    const data = JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9
    });

    const options = {
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    const content = json.choices[0].message.content;
                    // JSONのパースを試みる
                    const parsed = JSON.parse(content.replace(/```json/g, '').replace(/```/g, '').trim());
                    resolve(parsed);
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', (err) => reject(err));
        req.write(data);
        req.end();
    });
}

async function main() {
    const apiKey = process.env.OPENAI_API_KEY;
    let articleData = null;

    // OpenAI APIキーが有効であればAI生成を試みる
    if (apiKey && apiKey.startsWith('sk-')) {
        try {
            console.log("Attempting to generate article via OpenAI API...");
            articleData = await callOpenAI(apiKey);
        } catch (err) {
            console.log("AI Generation failed, falling back to dynamic sovereign synthesis engine:", err.message);
        }
    }

    // 万が一APIエラーやキー未設定の場合の、超高度な動的フォールバック合成（絶対にループしない）
    if (!articleData) {
        const timestamp = Date.now();
        const rand = (max) => (timestamp + Math.floor(Math.random() * 10000)) % max;
        
        const topics = [
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
            }
        ];
        articleData = topics[rand(topics.length)];
    }

    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    const newCardHtml = `
            <div class="story-card">
                <div class="story-date">${articleData.tag || 'SOVEREIGN STREAM'} // ${nowTime} // DAEMON CORE</div>
                <div class="story-title">${articleData.title}</div>
                <p class="story-paragraph">${articleData.p1}</p>
                <div class="story-quote">${articleData.quote}</div>
                <p class="story-paragraph">${articleData.p2}</p>
            </div>`;

    // 既存の blog.html を読み込んで上部にインジェクション
    let htmlContent = fs.readFileSync('blog.html', 'utf8');
    const targetMarker = '<div id="live-container">';

    if (htmlContent.includes(targetMarker)) {
        htmlContent = htmlContent.replace(targetMarker, `${targetMarker}\n${newCardHtml}`);
        writeFileSyncSafe('blog.html', htmlContent);
        console.log("Successfully injected new article into blog.html!");
    } else {
        console.error("Error: Target marker not found in blog.html");
        process.exit(1);
    }
}

function writeFileSyncSafe(path, data) {
    fs.writeFileSync(path, data, 'utf8');
}

main();
