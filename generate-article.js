// generate-article.js
const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // GitHub Secretsから自動読み込み
});

async function generateTechnicalPaper() {
    console.log("⚡ 独自自律AIデーモン: 世界最高峰の次世代技術論文の生成を開始...");

    const prompt = `
あなたは世界最高峰の分散システム・P2Pプロトコル・ゼロトラスト暗号工学の天才アーキテクトです。
誰にも真似できない、極めて高度で専門的な次世代分散インフラストラクチャに関する「超技術論文」を1件生成してください。

以下のJSONフォーマットのみで出力してください（マークダウンのバッククォート ```json などは含めず、純粋なJSON文字列のみにしてください）。

{
  "ref": "QX-9850",
  "title": "（ここに誰も書けない世界最先端の分散システムに関する鋭いタイトル）",
  "category": "ADVANCED DISTRIBUTED ARCHITECTURE",
  "abstract": "（ここにシステムの核心を突く高密度なアブストラクトを3〜4行で記述）",
  "codeSnippet": "// Core Protocol Implementation\\nasync function executeZeroTrustConsensus() {\\n  // 高度な非同期P2Pゴシップ同期と自己修復コードをここに記述\\n}",
  "deepContent": "（ここに、メモリ管理、ゼロ知識証明、スループット最適化、暗号学的整合性に関する非常に詳細で専門的な技術解説を、マークダウンまたはHTMLタグ混じりでたっぷり記述してください。ボリュームは多めで、専門用語を惜しみなく使ってください）"
}
`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // または gpt-4
            messages: [{ role: "user", content: prompt }],
            temperature: 0.85,
        });

        const rawText = response.choices[0].message.content.trim();
        // 万が一マークダウンがついている場合の保険
        const cleanJson = rawText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
        const articleData = JSON.parse(cleanJson);

        console.log(`✅ 論文生成成功: [${articleData.ref}] ${articleData.title}`);
        
        // journals.html を読み込んで、新しい論文を最上部へ自動挿入する処理
        updateJournalsHtml(articleData);

    } catch (error) {
        console.error("❌ 論文生成エラー:", error);
        process.exit(1);
    }
}

function updateJournalsHtml(article) {
    const htmlPath = './journals.html';
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // 新しく挿入するHTMLカードのテンプレート
    const newArticleHtml = `
    <article class="article-card" style="margin-bottom: 30px;">
        <div class="article-meta">
            <span>${new Date().toISOString().split('T')[0]} // ${article.category}</span>
            <span>REF: ${article.ref}</span>
        </div>
        <h2 class="article-title">${article.title}</h2>
        <div class="article-body">
            <p>${article.abstract}</p>
            <div class="code-snippet">${article.codeSnippet}</div>
            <div style="margin-top: 15px; color: #94a3b8; font-size: 0.95rem; line-height: 1.7;">
                ${article.deepContent}
            </div>
        </div>
        <div class="paywall-locked" style="margin-top: 20px;">
            <div class="blur-content">
                <p><b>[極秘コア・ソースコード & 完全版数式モデル]</b></p>
                <div class="code-snippet">// Full Production Engine Implementation...</div>
            </div>
            <div class="paywall-overlay" style="background: linear-gradient(to bottom, rgba(11,17,32,0.5), rgba(11,17,32,0.96)); padding: 20px; text-align: center;">
                <div style="color: #fff; font-weight: 800; font-size: 15px; margin-bottom: 6px;">🔒 プレミアム・テクニカル限定エリア</div>
                <div style="color: #9ca3af; font-size: 13px; margin-bottom: 12px;">完全なソースコードと全自動同期の全容を即時アンロック</div>
                <button class="btn-access" onclick="openModal()">150 JPY で全コードを解放する</button>
            </div>
        </div>
        <div class="status-box" style="margin-top: 15px;">
            <span style="color:#f59e0b; font-weight:bold;">LOCKED / PREMIUM CONTENT</span>
            <span style="font-size: 10px; color: var(--text-muted);">Protocol v6.0</span>
        </div>
    </article>`;

    // feed-container の直後に新しい記事を挿入する
    const targetMarker = 'id="feed-container">';
    if (htmlContent.includes(targetMarker)) {
        htmlContent = htmlContent.replace(targetMarker, targetMarker + '\n' + newArticleHtml);
        fs.writeFileSync(htmlPath, htmlContent, 'utf8');
        console.log("✨ journals.html への自動コード埋め込みが完了しました！");
    } else {
        console.error("❌ 挿入マーカーが見つかりませんでした。");
    }
}

generateTechnicalPaper();
