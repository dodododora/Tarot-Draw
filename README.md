<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Tarot Draw App

This is a React Web API built with Vite, Tailwind CSS, and Framer Motion.
View your app in AI Studio: https://ai.studio/apps/4b217963-5260-423c-9cd8-a574fde1eb56

## 🚀 Run Locally

**Prerequisites:** Node.js (v20+ recommended)

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Copy `.env.example` to `.env` or `.env.local` and set your Gemini API Key:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   The app will typically run on `http://localhost:3000` (or `http://localhost:5173`).

4. **Build for Production:**
   ```bash
   npm run build
   ```

## 🌐 Deploying with GitHub Actions

This project includes a pre-configured GitHub Action (`.github/workflows/deploy.yml`) to automatically build and deploy to **GitHub Pages** whenever you push to the `main` or `master` branch.

**To Enable GitHub Pages Deployment:**
1. Go to your repository settings on GitHub.
2. Navigate to **Pages** on the left sidebar.
3. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
4. The workflow will run automatically on the next push.

*Note: The `vite.config.ts` has been configured with `base: '/Tarot-Draw/'` to ensure proper asset loading on GitHub Pages. If you rename your repository, change this base path.*

## 📁 Git Ignore Strategy

The `.gitignore` is optimized for continuous integration and avoids commiting:
- Dependency directories (`node_modules`)
- Build outputs (`dist`, `build`)
- Various log files
- Local environment files holding API Keys (`.env`, `.env.local`, etc. except `.env.example`)
- OS specific files (`.DS_Store`) and IDE settings
