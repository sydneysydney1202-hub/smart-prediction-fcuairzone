# 🌡️ Smart Prediction - 逢甲大學 AI 熱區預測系統

> 結合時間序列分析，預測未來一小時的校園人潮與溫度趨勢

[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/new)

## ✨ 功能特性

- 🗺️ **實時熱區地圖** - 校園各地點的人潮與溫度狀態
- 📊 **時間序列預測** - 基於歷史數據預測人潮與溫度
- 🔔 **主動提示** - 「根據歷史數據，該區域人潮即將在30分鐘後達到高峰」
- ➕ **自主新增地點** - 用戶可新增校園未列出的地點
- 📝 **用戶提交狀態** - 用戶主動提供各地點的人潮/溫度狀態
- 🌤️ **天氣整合** - 即時溫度、濕度、天氣狀況

## 🛠️ 技術棧

### 前端
- **React** + TypeScript
- **Tailwind CSS** - UI 設計
- **Recharts** - 圖表展示
- **Axios** - API 請求

### 後端
- **Express.js** (Node.js)
- **PostgreSQL** - 數據存儲
- **Redis** - 實時緩存
- **OpenWeather API** - 氣象數據

## 🚀 一鍵部署

### Railway (推薦 ⭐)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new?templateId=)

1. 點擊上面的按鈕
2. 連接你的 GitHub 倉庫
3. 設置環境變數
4. 自動部署完成！

詳見 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 本地開發

```bash
# 克隆倉庫
git clone https://github.com/sydneysydney1202-hub/smart-prediction-fcuairzone.git
cd smart-prediction-fcuairzone

# 安裝依賴
npm install:all

# 設置環境變數
cp .env.example .env

# 啟動開發環境
docker-compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

訪問 http://localhost:3000

## 📊 校園地點預設

- 📚 圖書館
- 🍽️ 學生餐廳
- 🏃 運動中心
- 🎓 教學大樓 A
- 💻 資訊大樓
- 🛏️ 宿舍區

## 🔑 環境變數

```
OPENWEATHER_API_KEY=你的OpenWeather API密鑰
DATABASE_URL=PostgreSQL連接字符串
REDIS_URL=Redis連接字符串
JWT_SECRET=任意複雜字符串
NODE_ENV=production
```

## 📈 API 端點

### 地點相關
- `GET /api/locations` - 獲取所有地點
- `POST /api/locations` - 新增地點
- `GET /api/locations/:id` - 獲取特定地點

### 預測相關
- `GET /api/predictions/:locationId` - 獲取未來1小時預測

### 用戶提交
- `POST /api/submissions` - 提交人潮/溫度數據
- `GET /api/submissions/location/:locationId` - 獲取地點提交歷史

### 天氣相關
- `GET /api/weather/current` - 當前天氣
- `GET /api/weather/forecast` - 5天預報

## 🤝 貢獻方式

1. Fork 本倉庫
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📝 授權

MIT License - 詳見 [LICENSE](LICENSE) 檔案

## 📧 聯絡方式

- GitHub Issues：報告 bug 或建議功能
- GitHub Discussions：進行功能討論

---

**Made for Feng Chia University** 🎓

**部署狀態**：[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/new)
