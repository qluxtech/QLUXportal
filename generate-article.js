// generate-article.js
const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function generateTechnicalPaper() {
    console.log("⚡ 独自自律AIデーモン: 世界最高峰の熱狂的テクニカル論文の生成を開始...");

    const prompt = `
あなたは世界最高峰の分散システム・P2Pプロトコル・ゼロトラスト暗号工学の天才アーキテクトであり、読む者の知的好奇心を狂気的なまでに刺激するカリスマ技術ライターです。
既存のブロックチェーンやクラウドインフラの常識を鮮やかに論破し、読者が「マジか…この発想は天才的だ」と興奮して心拍数が上がるような、切れ味の鋭い熱い超技術論文を1件生成してください。

以下のJSONフォーマットのみで出力してください（マークダウンのバッククォート ```json などは含めず、純粋なJSON文字列のみにしてください）。

{
  "ref": "QX-" + Math.floor(1000 + Math.random() * 9000),
  "title": "（ここに読者の知的好奇心を強烈に刺激する、挑発的で圧倒的なタイトル）",
  "category": "ADVANCED DISTRIBUTED ARCHITECTURE",
  "abstract": "（ここに既存の限界を容赦なくぶった切り、システムの核心を突く高密度で熱いアブストラクトを3〜4行で記述）",
  "codeSnippet": "// Free Preview: Core Protocol Logic\\nasync function executeBlazingFastConsensus() {\\n  // 読者を熱狂させる導入部分の美しいコードスニペット\\n}",
  "deepContent": "（ここに、メモリ管理、ゼロ知識証明、スループット最適化に関する、専門的でありながら読者を夢中にさせる熱量の高い解説をたっぷり記述してください。この直下でBSV決済のペイウォールに入ります）"
}
`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.9,
        });

        const rawText = response.choices[0].message.content.trim();
        const cleanJson = rawText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
        const articleData = JSON.parse(cleanJson);

        console.log(`✅ 熱狂論文の生成成功: [${articleData.ref}] ${articleData.title}`);
        
        updateJournalHtml(articleData);

    } catch (error) {
        console.error("❌ 論文生成エラー:", error);
        process.exit(1);
    }
}

function updateJournalHtml(article) {
    const htmlPath = './Journal.html'; // ターゲットを正しい Journal.html に指定
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Journal.htmlの構造に完全対応した熱狂＆BSVペイウォール付きカード
    const newArticleHtml = `
    <article class="article-card" style="margin-bottom: 35px; border: 1px solid rgba(245, 158, 11, 0.3); box-shadow: 0 0 25px rgba(245, 158, 11, 0.08);">
        <div class="article-meta">
            <span style="color: #f59e0b; font-weight: bold;">🔥 HOT / ${article.category}</span>
            <span>REF: ${article.ref}</span>
        </div>
        <h2 class="article-title" style="font-size: 1.35rem; margin-top: 8px; color: #fff;">${article.title}</h2>
        <div class="article-body">
            <p style="font-size: 1.05rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 15px;">${article.abstract}</p>
            
            <div style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 5px;">// 無料プレビュー領域: 核心へ迫るロジック</div>
            <div class="code-snippet">${article.codeSnippet}</div>
            
            <div style="margin-top: 18px; color: #cbd5e1; font-size: 0.98rem; line-height: 1.8;">
                ${article.deepContent}
            </div>
        </div>

        <!-- BSV一撃ペイウォール領域 -->
        <div class="paywall-locked" style="margin-top: 25px; position: relative; border-radius: 8px; overflow: hidden;">
            <div class="blur-content" style="filter: blur(6px); opacity: 0.3; pointer-events: none; user-select: none; background: #0b1120; padding: 20px;">
                <p><b>[極秘コア・ソースコード & 完全版ゼロトラスト実装]</b></p>
                <div class="code-snippet">// Full Production Engine Implementation...\\nasync function bypassGlobalBottleneck() {\\n  // 誰もが欲しがる完全なプロダクション実装コード...\\n}</div>
            </div>
            
            <div class="paywall-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(11,17,32,0.6), rgba(11,17,32,0.98)); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; text-align: center;">
                <div style="color: #f59e0b; font-weight: 800; font-size: 16px; margin-bottom: 6px;">⚡ 続きの全コード・完全版数式モデルを読む</div>
                <div style="color: #9ca3af; font-size: 13px; margin-bottom: 15px;">「この先を知りたい」と思った瞬間、BSVマイクロペイメントが一撃で世界を繋ぐ</div>
                <button class="btn-access" onclick="openModal()" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 900; padding: 12px 28px; border-radius: 6px; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(245,158,11,0.4);">
                    ⚡ BSVで一撃アンロック（即時閲覧）
                </button>
            </div>
        </div>

        <div class="status-box" style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color:#f59e0b; font-weight:bold; font-size: 11px;">🔥 リアルタイム生成・ホットストリーム</span>
            <span style="font-size: 11px; color: var(--text-muted);">Protocol v6.0 / BSV Micro-Tx Ready</span>
        </div>
    </article>`;

    const targetMarker = 'id="feed-container">';
    if (htmlContent.includes(targetMarker)) {
        htmlContent = htmlContent.replace(targetMarker, targetMarker + '\n' + newArticleHtml);
        fs.writeFileSync(htmlPath, htmlContent, 'utf8');
        console.log("✨ Journal.html の最上部に熱狂論文が完璧にインプットされました！");
    } else {
        console.error("❌ 挿入マーカーが見つかりませんでした。");
    }
}

generateTechnicalPaper();
