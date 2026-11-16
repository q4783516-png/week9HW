# GitHub Pages 部署與專案執行指南

本專案為完全的靜態前端應用（SPA），可直接部署於 **GitHub Pages**、Netlify、Vercel 等靜態託管平台。

---

## 1. 本地開發與執行

### 環境需求
- **Node.js**: v18.0.0 以上（本專案已驗證 v22.14.0）
- **npm**: v9.0.0 以上（本專案已驗證 10.9.2）

### 操作指令

```bash
# 1. 安裝依賴套件
npm install

# 2. 啟動本機開發伺服器（支援熱重載 HMR）
npm run dev

# 3. 執行單元測試
npm run test

# 4. 生產版本打包建置
npm run build

# 5. 預覽打包後的生產版本
npm run preview
```

---

## 2. GitHub Pages 自動化部署（GitHub Actions）

專案已預先配置 `.github/workflows/deploy.yml`，只要推送到 GitHub `main` 分支，即會自動執行測試、建置並發布到 GitHub Pages。

### 設定步驟

1. 將本專案推送至 GitHub Repository：
   ```bash
   git add .
   git commit -m "feat: complete SynapsePKB v1 implementation"
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

2. 進入 GitHub 專案倉庫設定：
   - 點擊 **Settings** -> **Pages**。
   - 在 **Build and deployment** > **Source** 下拉選單選擇 **GitHub Actions**。

3. Actions 觸發流程：
   - GitHub Actions 自動偵測 `main` 分支更新。
   - 安裝依賴 -> 執行 `npm test` -> 執行 `npm run build`。
   - 將產出的 `dist/` 目錄部署到 GitHub Pages。
   - 部署完成後，即可透過 `https://<your-username>.github.io/<repo-name>/` 存取。

### Vite Base Path 配置說明

若部署在子路徑（例如 `https://<user>.github.io/<repo>/`），在 `vite.config.ts` 中配置：
```typescript
export default defineConfig({
  base: './', // 採用相對路徑，相容於任何根目錄或子目錄部署
  plugins: [react()],
});
```
採用 `./` 相對路徑可免除指定固定倉庫名稱的麻煩，無論本地開啟、自訂網域或 GitHub Pages 子目錄皆可開箱即用。
