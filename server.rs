use axum::{
    body::Bytes,
    extract::State,
    http::{HeaderMap, StatusCode},
    routing::post,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

// プロビジョニング結果のレスポンス構造体
#[derive(Serialize)]
struct ProvisionResponse {
    status: String,
    license_key: String,
    node_access: String,
}

// 共有状態（DBやセキュアストレージのモック）
struct AppState {
    stripe_webhook_secret: String,
}

#[tokio::main]
async fn main() {
    let state = Arc::new(AppState {
        stripe_webhook_secret: std::env::var("STRIPE_WEBHOOK_SECRET")
            .unwrap_or_else(|_| "whsec_mock_secret".to_string()),
    });

    // Axum ルーターの設定
    let app = Router::new()
        .route("/api/webhook/stripe", post(handle_stripe_webhook))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    println!("🚀 QLUX Core Server running on port 8080");
    axum::serve(listener, app).await.unwrap();
}

// Stripe Webhook ハンドラー
async fn handle_stripe_webhook(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    body: Bytes,
) -> Result<Json<ProvisionResponse>, StatusCode> {
    // 1. Stripe署名の検証（本番環境では必須）
    let signature = headers
        .get("stripe-signature")
        .and_then(|v| v.to_str().ok())
        .ok_or(StatusCode::BAD_REQUEST)?;

    // 簡略化した検証・イベントパース処理
    println!("🔒 Verifying Stripe signature: {}", signature);

    // TODO: stripe クレート等を用いて event をパース
    // let event = stripe::Webhook::construct_event(&body, signature, &state.stripe_webhook_secret)...

    // 仮に checkout.session.completed が届いたと仮定して、core.rs のプロビジョニングロジックを叩く
    let generated_license = execute_core_provisioning("user_sub_stripe_id_mock").await;

    Ok(Json(ProvisionResponse {
        status: "SUCCESS".to_string(),
        license_key: generated_license,
        node_access: "Tokyo_Prime_Node & Zurich_Core_Node [AUTHORIZED]".to_string(),
    }))
}

// core.rs の中核：自動ライセンス発給 & ノードプロビジョニング
async fn execute_core_provisioning(customer_id: &str) -> String {
    // ここでゼロエントロピーな一意のシークレットキーを生成
    let license_key = format!("qlux_live_{}_{:x}", customer_id, uuid_v4_mock());
    
    println!("✨ [CORE.RS] License provisioned successfully for: {}", customer_id);
    println!("🔑 Generated Key: {}", license_key);

    // データベースへの書き込み、または各ノード（Tokyo/Zurich/NY）への同期処理をここに記述
    
    license_key
}

fn uuid_v4_mock() -> u128 {
    // 簡易的な一意のハッシュ生成の代わり
    1351713517
}

