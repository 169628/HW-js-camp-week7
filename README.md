# 第七週作業：第三方套件實戰整合

## 情境說明

本週作業學習使用第三方套件優化電商系統，包含 **dayjs**（日期處理）與 **axios**（HTTP 請求），並學習資料驗證與訂單服務模組化設計。
API 串接練習延續使用學院的 [LiveJS 電商 API](https://hexschool.github.io/hexschoolliveswagger/)。

---

## 快速開始

### Step 1：環境準備

1. 確認 Node.js 版本 >= 18
2. 下載此作業專案後，需打開終端機輸入 `npm install`

### Step 2：設定環境變數

在專案根目錄建立 `.env` ，並在 `.env` 檔案中設定環境變數：

```bash
API_PATH=your-api-path
API_KEY=your-admin-token
```

如果還未註冊學院的 [LiveJS 電商 API](https://hexschool.github.io/hexschoolliveswagger/)：
1. 請進入到[此網站](https://livejs-api.hexschool.io/)，並點選「註冊」，註冊帳號成功後，登入到網站
2. 登入後即可進入到 API 申請畫面，請依照說明建立 API Path，也可以取得 API Key

### Step 3：開始寫作業

開啟 `homework.js`，按照註解提示完成所有函式


### Step 4：測試你的程式碼

```bash
# 執行快速測試（看基本輸出）
npm start

# 執行完整 Jest 測試（看通過/失敗）
npm test
```

---

## 主線任務

本週作業分為五個任務，請依照說明，完成對應的功能要求：

| 任務 | 說明 |
| --- | --- |
| 任務一 | dayjs 日期處理 |
| 任務二 | 資料驗證 |
| 任務三 | 唯一識別碼 |
| 任務四 | Axios API 串接 |
| 任務五 | OrderService 整合應用 |

### 【任務一：dayjs 日期處理】

- `formatOrderDate(timestamp)` - 將 Unix timestamp 轉為 `YYYY/MM/DD HH:mm` 格式
- `getDaysAgo(timestamp)` - 計算訂單距離今天為幾天
- `isOrderOverdue(timestamp)` - 判斷是否超過 7 天
- `getThisWeekOrders(orders)` - 取得本週的訂單

### 【任務二：資料驗證】

- `validateOrderUser(data)` - 驗證訂單使用者資料
- `validateCartQuantity(quantity)` - 驗證購物車數量

### 【任務三：唯一識別碼】

- `generateOrderId()` - 產生訂單編號（格式：`'ORD-xxxxxxxx'`）
- `generateCartItemId()` - 產生購物車項目 ID（格式：`'CART-xxxxxxxx'`）

### 【任務四：Axios API 串接】

- `getProductsWithAxios()` - 使用 axios 取得產品列表
- `addToCartWithAxios(productId, quantity)` - 使用 axios 加入購物車
- `getOrdersWithAxios()` - 使用 axios 取得訂單（需認證）

### 【任務四延伸：請說明 fetch 和 axios 的主要差異】

使用註解來條列：

```jsx
/*
1. ____________________________________

2. ____________________________________

3. ____________________________________
*/
```

### 【任務五：OrderService 整合應用】

- `fetchOrders()` - 使用 axios 取得訂單
- `formatOrders(orders)` - 為每筆訂單加上 `formattedDate` 欄位
- `filterUnpaidOrders(orders)` - 篩選 `paid: false` 的訂單

---

## API 參考

### LiveJS API 端點

| 方法 | 端點 | 說明 |
|------|------|------|
| GET | `/api/livejs/v1/customer/{api_path}/products` | 取得產品列表 |
| GET | `/api/livejs/v1/customer/{api_path}/carts` | 取得購物車 |
| POST | `/api/livejs/v1/customer/{api_path}/carts` | 加入購物車 |
| GET | `/api/livejs/v1/admin/{api_path}/orders` | 取得訂單（需認證） |

---

## 測試與驗證

本作業使用 **Jest** 進行自動化測試。

### 測試指令
1. 執行快速測試（看基本輸出）：`npm start`
2. 完整測試：`npm test`

### 測試結果說明
- ✓ 表示測試通過
- ✕ 表示測試失敗

### 測試項目（共 50 項）

| 群組 | 測試數量 | 
|----------|---------|
| 任務一：dayjs 日期處理 | 16 項 | 
| 任務二：資料驗證 | 16 項 | 
| 任務三：ID 產生 | 8 項 | 
| 任務四：Axios API | 5 項 | 
| 任務五：OrderService | 5 項 | 

---

## 繳交方式

1. 完成 `homework.js` 中的所有函式
2. 執行 `npm test` 確保所有測試通過
3. 將程式碼上傳至 GitHub
4. 提交 GitHub 連結

---

## 常見問題

**Q: 測試失敗時，可先檢查跟確認以下：**

1. 確認 `.env` 設定正確
2. 確認網路連線正常
3. 檢查 `homework.js` 的函式是否有正確回傳值
4. 確認 async/await 語法正確使用




