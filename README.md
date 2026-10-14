# NutriGuard - Clinical Food Safety & Nutrition Diagnostic

An intelligent, full-stack clinical food safety and nutrition label diagnostic application. NutriGuard evaluates meal photos, food packaging labels, and ingredient statements against patient medical conditions (e.g., **Hypertension**, **Type 2 Diabetes**) and allergen alerts (e.g., **Peanuts**, **Gluten**). Powered by **Gemini 3.8 Flash** multimodal vision and an Express REST API backend.

---

## Key Features

- **Multimodal Visual Extraction**: Analyzes food packaging and nutrition facts panels using Google's Gemini 3.8 Flash model.
- **Dynamic Safety Triaging**: Classifies items into `SAFE` (8–10), `CAUTION` (4–7), and `UNSAFE` (1–3) with clinical rationale.
- **Specific Nutritional Risk Profiling**: Pinpoints sodium vascular volume expansion, postprandial glucose spikes, and hidden allergen cross-contamination.
- **Therapeutic Food Alternatives**: Recommends medically compliant alternatives tailored to active clinical conditions.
- **Text & Recipe Analysis**: Paste ingredient statements, recipes, or restaurant dishes without requiring an image.
- **Side-by-Side Comparison**: Head-to-head clinical analysis of two food choices to determine the safer option.
- **Strict JSON Viewer**: Export clinical reports matching the exact required schema with one-click copy and JSON download.
- **Dark Mode**: Persistent dark and light mode themes with system preference detection.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express, TypeScript (`tsx`)
- **AI Model**: `@google/genai` SDK (`gemini-3.8-flash`)
- **Architecture**: Single-port full-stack architecture with Vite middlewares mounted in dev and static build in production.

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/<YOUR-USERNAME>/nutriguard.git
   cd nutriguard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment secrets:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Build for production:
   ```bash
   npm run build
   npm start
   ```

---

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze-food` | Multimodal OCR & clinical analysis of packaging/label images |
| `POST` | `/api/analyze-text` | Clinical evaluation of raw ingredient statements or recipes |
| `POST` | `/api/compare-foods` | Side-by-side clinical comparison of two food items |
| `GET` | `/api/patient-profiles`| Retrieve pre-configured and custom patient medical profiles |
| `GET` | `/api/scans` | Query diagnostic scan logs and aggregated compliance metrics |
| `GET` | `/api/health` | Health check, uptime, memory, and Gemini AI connection status |
| `GET` | `/api/api-docs` | Interactive API documentation metadata |

---

## License

Apache-2.0
