# SalesMate Pro AI | Strategic Foodservice Intelligence

**SalesMate Pro AI** is a high-performance strategic dashboard designed for modern foodservice professionals and consultants. It leverages Google's Gemini 3 Flash model to provide real-time account audits, menu engineering insights, and automated marketing asset generation.

## 🚀 Key Features

- **Strategic Account Audits**: Instant, AI-driven analysis of restaurants, healthcare facilities, and hospitality accounts.
- **Plate-Profit Auditor**: Advanced ingredient-level costing with real-time margin and yield calculations.
- **Buddy AI Consultant**: A persistent strategic companion to help refine sales pitches and identify operational leverage.
- **Automated Flyer Engine**: Generates high-impact, print-ready PDF marketing assets with one click.
- **Brutalist UI**: High-contrast, performance-focused design optimized for field use.

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **AI Engine**: @google/genai (Gemini 3 Pro/Flash)
- **Bundler**: Vite
- **Export**: html2pdf.js

## 📦 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup Environment**:
   Create a `.env` file in the root and add your API key:
   ```env
   VITE_API_KEY=your_gemini_api_key_here
   ```

3. **Run the app**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

This project is optimized for **Vercel** or **Netlify**.
- **Important**: You must set an Environment Variable named `API_KEY` in your deployment settings containing your Google Gemini API Key.

---

### ⚖️ Legal & Ownership
**Ownership and Rights Statement**: This application and all of its components, including but not limited to the code, processes, models, and future versions, are fully owned and controlled by **Billy James Harman**. Billy James Harman retains all rights to own, control, distribute, and sell this application and its associated elements.

© 2025 SalesMate Pro AI | Field Intelligence Unit
