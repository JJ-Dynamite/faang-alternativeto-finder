use axum::{
    routing::get,
    Router, Json, extract::Query,
    response::IntoResponse,
};
use serde::{Deserialize, Serialize};
use tower_http::cors::{CorsLayer, Any};
use tracing_subscriber;

#[derive(Deserialize)]
struct SearchQuery {
    q: String,
    platform: Option<String>,
}

#[derive(Serialize)]
struct Alternative {
    name: String,
    description: String,
    platform: Vec<String>,
    price: String,
    rating: f32,
    url: String,
    icon: String,
}

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    service: String,
    version: String,
}

async fn health_check() -> impl IntoResponse {
    Json(HealthResponse {
        status: "healthy".to_string(),
        service: "AlternativeTo Finder".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    })
}

async fn root() -> impl IntoResponse {
    Json(serde_json::json!({
        "service": "AlternativeTo Finder",
        "version": env!("CARGO_PKG_VERSION"),
        "endpoints": {
            "GET /search?q=": "Search for alternatives",
            "GET /health": "Health check"
        }
    }))
}

async fn search_alternatives(
    Query(params): Query<SearchQuery>,
) -> impl IntoResponse {
    let alternatives = vec![
        Alternative {
            name: "Figma".to_string(),
            description: "Collaborative interface design tool".to_string(),
            platform: vec!["Web".to_string(), "Desktop".to_string()],
            price: "Free / $12/mo".to_string(),
            rating: 4.8,
            url: "https://figma.com".to_string(),
            icon: "🎨".to_string(),
        },
        Alternative {
            name: "Penpot".to_string(),
            description: "Open source design tool".to_string(),
            platform: vec!["Web".to_string()],
            price: "Free".to_string(),
            rating: 4.5,
            url: "https://penpot.app".to_string(),
            icon: "✏️".to_string(),
        },
    ];

    Json(serde_json::json!({
        "success": true,
        "query": params.q,
        "results": alternatives
    }))
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    let cors = CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any);
    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health_check))
        .route("/search", get(search_alternatives))
        .layer(cors);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001").await.unwrap();
    tracing::info!("AlternativeTo Finder backend running on port 3001");
    axum::serve(listener, app).await.unwrap();
}
