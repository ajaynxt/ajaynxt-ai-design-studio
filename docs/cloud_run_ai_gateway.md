# ⚡ AJAYNXT AI Design Studio — Cloud Run Multi-Provider AI API Gateway

> **Microservice:** `ajaynxt-ai-studio-gateway`  
> **Runtime:** Google Cloud Run (Node.js 20/24 Alpine Container)  
> **Security:** Firebase ID Token Authentication + App Check + Rate Limiting + Secret Manager  
> **Monthly Budget Control:** Configurable hard-stop spending limits ($25.00 default) with 80% warning alerts

---

## 1. Multi-Provider Adapters & Licensing Matrix

| Provider / Model | Supported Capabilities | Free Quota | Commercial Pricing | License & Terms | Fallback Rule |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Google Gemini API** (`gemini-1.5-flash`, `gemini-1.5-pro`) | Design brief refinement, creative ontology, multimodal image critique | **15 RPM, 1M TPM, 1,500 RPD** free on Google AI Studio | $0.075 / 1M input tokens, $0.30 / 1M output tokens | Google Cloud Platform Terms | Primary LLM; falls back to structured client ontology if unconfigured |
| **NVIDIA NIM Microservices** (`sdxl-turbo`, `flux-1-schnell`) | Fast latent image generation, texture synthesis | **1,000 free credits** on NVIDIA NGC Developer account | ~$0.002 to $0.005 per inference call | NVIDIA Community & Commercial API License | Explicit opt-in only; no silent switch to paid Imagen 3 |
| **Google Imagen 3** (`imagen-3.0-generate-002`) | Master-quality text-to-image commercial artwork | No free tier (Pay-as-you-go) | $0.030 per standard 1024×1024 image | Google Cloud Vertex AI Terms | Explicit opt-in only; requires verified user confirmation |
| **Photoroom Studio API** (`segment`) | Product & packaging cutout, genuine alpha, shadow synthesis | Sandbox test calls only | $0.050 to $0.080 per high-resolution cutout | Photoroom Commercial API License | Primary background remover; falls back to client canvas matting if unconfigured |
| **remove.bg API** (`removebg`) | Fine hair, fur, and portrait edge matting | **1 free preview credit / 50 preview calls/mo** | $0.120 to $0.200 per full-res image | Kaleido AI / Canva Terms | Alternative provider; requires `allowAlternativeProvider: true` |
| **Google Cloud Vision OCR** (`DOCUMENT_TEXT_DETECTION`) | Label text detection, nutritional declarations, brand typography | **First 1,000 units/month 100% FREE** | $1.50 per 1,000 units above free tier | Google Cloud Platform Terms | Primary OCR engine |
| **Hugging Face Serverless Inference** (`FLUX.1-schnell`) | Experimental visual concepts, rapid prototyping | Community rate-limited free tier with user token | Free serverless tier subject to hourly rate limits | OpenRAIL / Apache 2.0 based on model weights | Optional experimental provider |

---

## 2. Strict Provider Routing & Zero Silent Fallback Policy

1. **Explicit Routing**: Every request must specify its target provider (`gemini`, `nvidia_nim`, `google_imagen`, `photoroom`, `remove_bg`, `cloud_vision`, or `hugging_face`).
2. **No Silent Paid Failovers**: If a free or lower-cost provider (such as NVIDIA NIM or Photoroom Sandbox) experiences an outage or quota exhaustion, the gateway **strictly refuses** to silently redirect to a more expensive provider (e.g. Google Imagen 3 or remove.bg full-res) without explicit user permission (`allowAlternativeProvider: true`).
3. **Transparent State Reporting**: The gateway reports real-time provider states via `GET /api/v1/providers/status`:
   - `CONFIGURED`: API key present and active.
   - `UNCONFIGURED`: Key not provided in Secret Manager.
   - `UNAVAILABLE`: Upstream network failure.
   - `QUOTA_EXHAUSTED`: Daily or monthly quota depleted.

---

## 3. Project Budget Controls & Spending Hard Caps

- **Default Spending Limit**: **$25.00 / month** (configurable via `POST /api/v1/budget/limit`).
- **Warning Alert (80%)**: When monthly spending reaches 80% ($20.00), response header `X-Budget-Status: WARNING` is dispatched, and the studio UI surfaces a yellow warning banner.
- **Hard Generation Stop (100%)**: When monthly spending reaches 100% ($25.00), the gateway returns `HTTP 402 PAYMENT REQUIRED` (`BUDGET_LIMIT_EXCEEDED`) and immediately halts all paid generation calls to protect the owner from cost overruns.
- **Audit Logging**: Every single inference call records:
  - User ID
  - Provider ID
  - Operation type
  - Exact token or call count
  - Estimated cost in USD
  - Timestamp in Firestore `usage_events` collection.

---

## 4. Google Cloud Run Deployment Instructions

### Step 4.1: Store API Credentials in Google Secret Manager
Run these commands in your Google Cloud environment:

```bash
# 1. Google Gemini & Cloud Vision
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "your-gemini-key" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# 2. NVIDIA NIM API Key
gcloud secrets create NVIDIA_NIM_API_KEY --replication-policy="automatic"
echo -n "nvapi-your-key" | gcloud secrets versions add NVIDIA_NIM_API_KEY --data-file=-

# 3. Photoroom Studio API Key
gcloud secrets create PHOTOROOM_API_KEY --replication-policy="automatic"
echo -n "your-photoroom-key" | gcloud secrets versions add PHOTOROOM_API_KEY --data-file=-

# 4. remove.bg API Key
gcloud secrets create REMOVE_BG_API_KEY --replication-policy="automatic"
echo -n "your-removebg-key" | gcloud secrets versions add REMOVE_BG_API_KEY --data-file=-

# 5. Hugging Face Token (Optional)
gcloud secrets create HF_TOKEN --replication-policy="automatic"
echo -n "hf_your-token" | gcloud secrets versions add HF_TOKEN --data-file=-
```

### Step 4.2: Deploy to Cloud Run via Source
```bash
gcloud run deploy ajaynxt-ai-studio-gateway \
  --source gateway \
  --region asia-south1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 5 \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars NODE_ENV=production,FIREBASE_PROJECT_ID=ajaynxt-ai-design-studio,MONTHLY_BUDGET_LIMIT_USD=25.00 \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest,NVIDIA_NIM_API_KEY=NVIDIA_NIM_API_KEY:latest,PHOTOROOM_API_KEY=PHOTOROOM_API_KEY:latest,REMOVE_BG_API_KEY=REMOVE_BG_API_KEY:latest
```

---

## 5. Local Development & Testing

Run the gateway locally on your machine:

```bash
cd gateway
npm install
npm run dev
```

Run automated verification tests:
```bash
cd gateway
npm test
```
*Expected output: All 5 health, provider status, budget limits, routing, and request validation tests passing with zero errors.*
