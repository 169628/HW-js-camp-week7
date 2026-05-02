// ========================================
// 第七週作業：使用第三方套件優化電商系統
// 執行方式：npm install && node homework.js
// ========================================

// 載入環境變數與套件
require('dotenv').config({ path: '.env' });
const dayjs = require('dayjs');
const axios = require('axios');

// API 設定（從 .env 讀取）
const API_PATH = process.env.API_PATH;
const BASE_URL = 'https://livejs-api.hexschool.io';
const ADMIN_TOKEN = process.env.API_KEY;

// ========================================
// 任務一：日期處理 - dayjs
// ========================================

/**
 * 1. 將 Unix timestamp 轉換為可讀日期
 * @param {number} timestamp - Unix timestamp（秒）
 * @returns {string} - 格式 'YYYY/MM/DD HH:mm'，例如 '2024/01/01 08:00'
 */
function formatOrderDate(timestamp) {
  return dayjs.unix(timestamp).format('YYYY/MM/DD HH:mm')
}

/**
 * 2. 計算訂單距今幾天
 * @param {number} timestamp - Unix timestamp（秒）
 * @returns {string} - 例如 '3 天前' 或 '今天'
 */
function getDaysAgo(timestamp) {
  const today = dayjs();
  const orderDay = dayjs.unix(timestamp)
  const day = today.diff(orderDay,'day')
  if (day == 0){
    return "今天"
  }
  return `${day} 天前`
}

/**
 * 3. 判斷訂單是否超過 7 天（可能需要催付款）
 * @param {number} timestamp - Unix timestamp（秒）
 * @returns {boolean} - 超過 7 天回傳 true
 */
function isOrderOverdue(timestamp) {
  const today = dayjs();
  const orderDay = dayjs.unix(timestamp)
  const day = today.diff(orderDay,'day')
  if (day > 7){
    return true
  }
  return false
}

/**
 * 4. 取得本週的訂單
 * @param {Array} orders - 訂單陣列，每筆訂單有 createdAt 欄位
 * @returns {Array} - 篩選出 createdAt 在本週的訂單
 */
function getThisWeekOrders(orders) {
  const weekStart = dayjs().startOf('week')
  const weekEnd = dayjs().endOf('week')
  const result = orders.filter((i)=>{
    const orderDay = dayjs.unix(i.createdAt)
    return orderDay.isAfter(weekStart) && orderDay.isBefore(weekEnd)
  })
  return result
}

// ========================================
// 任務二：資料驗證（原生 JS 實作）
// ========================================

/**
 * 1. 驗證訂單使用者資料
 * @param {Object} data - { name, tel, email, address, payment }
 * @returns {Object} - { isValid: boolean, errors: string[] }
 *
 * 驗證規則：
 * - name: 不可為空
 * - tel: 必須是 09 開頭的 10 位數字
 * - email: 必須包含 @ 符號
 * - address: 不可為空
 * - payment: 必須是 'ATM', 'Credit Card', 'Apple Pay' 其中之一
 */
function validateOrderUser(data) {
  const errors = []

  if (!data.name || data.name.trim() === '') {
    errors.push('姓名不可為空')
  }
  if (!data.tel || data.tel.trim() === '') {
    errors.push('手機不可為空')
  } else if (!/^09\d{8}$/.test(data.tel)){
    errors.push('手機必須是 09 開頭的 10 位數字')
  }
  if (!data.email || !data.email.includes('@')) {
    errors.push('電子信箱必須包含 @ 符號')
  }
  if (!data.address || !data.address.trim() === '') {
    errors.push('地址不可為空')
  }
  if (!data.payment || data.payment.trim() === '') {
    errors.push('付款方式不可為空')
  } else if (!data.payment.includes('ATM') && !data.payment.includes('Credit Card') && !data.payment.includes('Apple Pay')){
    errors.push("付款方式必須是 'ATM', 'Credit Card', 'Apple Pay' 其中之一")
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * 2. 驗證購物車數量
 * @param {number} quantity - 數量
 * @returns {Object} - { isValid: boolean, error?: string }
 *
 * 驗證規則：
 * - 必須是正整數
 * - 不可小於 1
 * - 不可大於 99
 */
function validateCartQuantity(quantity) {
  if (quantity < 1){
    return { isValid: false, error: '不可小於 1' }
  } else if (quantity > 99){
    return { isValid: false, error: '不可大於 99' }
  } else if (quantity % 1 > 0){
    return { isValid: false, error: '不可為小數' }
  }
  return { isValid: true }
}

// ========================================
// 任務三：唯一識別碼（原生 JS 實作）
// ========================================

/**
 * 1. 產生訂單編號
 * @returns {string} - 格式 'ORD-xxxxxxxx'
 */
function generateOrderId() {
  const unique = Math.random().toString(36).slice(2) + Date.now().toString(36);
  return `ORD-${unique.slice(0, 8)}`;
}

/**
 * 2. 產生購物車項目 ID
 * @returns {string} - 格式 'CART-xxxxxxxx'
 */
function generateCartItemId() {
  const unique = Math.random().toString(36).slice(2) + Date.now().toString(36);
  return `CART-${unique.slice(0, 8)}`;
}

// ========================================
// 任務四：使用 Axios 串接 API
// ========================================

/**
 * 1. 取得產品列表（使用 Axios）
 * @returns {Promise<Array>} - 回傳 products 陣列
 */
async function getProductsWithAxios() {
  const response = await axios.get(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`)
  return response.data.products
}

/**
 * 2. 加入購物車（使用 Axios）
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function addToCartWithAxios(productId, quantity) {
  const response = await axios.post(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`,{
    "data": {
      "productId": productId,
      "quantity": quantity
    }
  })
  return response.data
}

/**
 * 3. 取得訂單（使用 Axios，需認證）
 * @returns {Promise<Array>} - 回傳訂單陣列
 */
async function getOrdersWithAxios() {
  const response = await axios.get(`${BASE_URL}/api/livejs/v1/admin/${API_PATH}/orders`,{ headers: { authorization: ADMIN_TOKEN } })
  return response.data.orders
}

/*
比較題：請說明 fetch 和 axios 的主要差異

1. axios 不需要手動轉 JSON

2. axios 不需要設定 Content-Type

3. axios 會自動拋錯誤
*/

// ========================================
// 任務五：整合應用 (挑戰)
// ========================================

/**
 * 建立一個完整的「訂單服務」物件
 */
const OrderService = {
  apiPath: API_PATH,
  baseURL: BASE_URL,
  token: ADMIN_TOKEN,

  /**
   * 使用 axios 取得訂單
   * @returns {Promise<Array>} - 訂單陣列
   */
  async fetchOrders() {
    const response = await axios.get(`${this.baseURL}/api/livejs/v1/admin/${this.apiPath}/orders`,{ headers: { authorization: this.token } })
    return response.data.orders
  },

  /**
   * 使用 dayjs 格式化訂單日期
   * @param {Array} orders - 訂單陣列
   * @returns {Array} - 為每筆訂單加上 formattedDate 欄位
   */
  formatOrders(orders) {
    orders[0].formattedDate = dayjs().format('YYYY/MM/DD HH:mm')
    return orders
  },

  /**
   * 篩選未付款訂單
   * @param {Array} orders - 訂單陣列
   * @returns {Array} - paid: false 的訂單
   */
  filterUnpaidOrders(orders) {
    return orders.filter((i)=>{
      return i.paid == false
    })
  },

  /**
   * 驗證訂單使用者資料
   * @param {Object} userInfo - 使用者資料
   * @returns {Object} - 驗證結果
   */
  validateUserInfo(userInfo) {
    return validateOrderUser(userInfo);
  },

  /**
   * 整合：取得未付款訂單，並格式化日期
   * @returns {Promise<Array>} - 格式化後的未付款訂單
   */
  async getUnpaidOrdersFormatted() {
    const orders = await this.fetchOrders();
    const unpaid = this.filterUnpaidOrders(orders);
    return this.formatOrders(unpaid);
  }
};

// ========================================
// 匯出函式供測試使用
// ========================================
module.exports = {
  API_PATH,
  BASE_URL,
  ADMIN_TOKEN,
  formatOrderDate,
  getDaysAgo,
  isOrderOverdue,
  getThisWeekOrders,
  validateOrderUser,
  validateCartQuantity,
  generateOrderId,
  generateCartItemId,
  getProductsWithAxios,
  addToCartWithAxios,
  getOrdersWithAxios,
  OrderService
};

// ========================================
// 直接執行測試
// ========================================
if (require.main === module) {
  // 測試資料
  const testOrders = [
    { id: 'order-1', createdAt: Math.floor(Date.now() / 1000) - 86400 * 3, paid: false },
    { id: 'order-2', createdAt: Math.floor(Date.now() / 1000) - 86400 * 10, paid: true },
    { id: 'order-3', createdAt: Math.floor(Date.now() / 1000), paid: false }
  ];

  async function runTests() {
    console.log('=== 第七週作業測試 ===\n');
    console.log('API_PATH:', API_PATH);
    console.log('');

    // 任務一測試
    console.log('--- 任務一：dayjs 日期處理 ---');
    const timestamp = 1704067200;
    console.log('formatOrderDate:', formatOrderDate(timestamp));
    console.log('getDaysAgo:', getDaysAgo(testOrders[0].createdAt));
    console.log('isOrderOverdue:', isOrderOverdue(testOrders[1].createdAt));
    console.log('getThisWeekOrders:', getThisWeekOrders(testOrders)?.length, '筆');

    // 任務二測試
    console.log('\n--- 任務二：資料驗證 ---');
    const validUser = {
      name: '王小明',
      tel: '0912345678',
      email: 'test@example.com',
      address: '台北市信義區',
      payment: 'Credit Card'
    };
    console.log('validateOrderUser (valid):', validateOrderUser(validUser));

    const invalidUser = {
      name: '',
      tel: '1234',
      email: 'invalid',
      address: '',
      payment: 'Bitcoin'
    };
    console.log('validateOrderUser (invalid):', validateOrderUser(invalidUser));

    console.log('validateCartQuantity (5):', validateCartQuantity(5));
    console.log('validateCartQuantity (0):', validateCartQuantity(0));

    // 任務三測試
    console.log('\n--- 任務三：ID 產生 ---');
    console.log('generateOrderId:', generateOrderId());
    console.log('generateCartItemId:', generateCartItemId());

    // 任務四測試
    if (API_PATH) {
      console.log('\n--- 任務四：Axios API 串接 ---');
      try {
        const products = await getProductsWithAxios();
        console.log('getProductsWithAxios:', products ? `成功取得 ${products.length} 筆產品` : '回傳 undefined');
      } catch (error) {
        console.log('getProductsWithAxios 錯誤:', error.message);
      }
    } else {
      console.log('\n--- 任務四：請先在 .env 設定 API_PATH ---');
    }

    console.log('\n=== 測試結束 ===');
    console.log('\n提示：執行 node test.js 進行完整驗證');
  }

  runTests();
}
