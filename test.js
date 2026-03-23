// ========================================
// 第七週作業 Jest 測試
// 執行方式：npm test
// ========================================

// 載入環境變數
require('dotenv').config({ path: '.env' });

const homework = require('./homework.js');

// 測試超時設定
jest.setTimeout(30000);

// 測試資料
const testOrders = [
  { id: 'order-1', createdAt: Math.floor(Date.now() / 1000) - 86400 * 3, paid: false },
  { id: 'order-2', createdAt: Math.floor(Date.now() / 1000) - 86400 * 10, paid: true },
  { id: 'order-3', createdAt: Math.floor(Date.now() / 1000), paid: false }
];

// ========================================
// 任務一：dayjs 日期處理
// ========================================
describe('任務一：dayjs 日期處理', () => {

  describe('formatOrderDate', () => {
    const timestamp = 1704067200; // 2024/01/01 08:00 

    test('應有實作（不為 undefined）', () => {
      const result = homework.formatOrderDate(timestamp);
      expect(result).toBeDefined();
    });

    test('應回傳字串', () => {
      const result = homework.formatOrderDate(timestamp);
      expect(typeof result).toBe('string');
    });

    test('格式應為 YYYY/MM/DD HH:mm', () => {
      const result = homework.formatOrderDate(timestamp);
      // 檢查格式：4位數/2位數/2位數 2位數:2位數
      expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}$/);
    });

    test('應正確轉換日期', () => {
      const result = homework.formatOrderDate(timestamp);
      expect(result).toMatch(/^2024\/01\/01/);
    });
  });

  describe('getDaysAgo', () => {
    test('應有實作（不為 undefined）', () => {
      const result = homework.getDaysAgo(testOrders[0].createdAt);
      expect(result).toBeDefined();
    });

    test('應回傳字串', () => {
      const result = homework.getDaysAgo(testOrders[0].createdAt);
      expect(typeof result).toBe('string');
    });

    test('今天的訂單應顯示「今天」', () => {
      const result = homework.getDaysAgo(testOrders[2].createdAt);
      expect(result).toBe('今天');
    });

    test('應包含 "天" 或 "今天"', () => {
      const result = homework.getDaysAgo(testOrders[0].createdAt);
      expect(result).toMatch(/天|今/);
    });
  });

  describe('isOrderOverdue', () => {
    test('應有實作（不為 undefined）', () => {
      const result = homework.isOrderOverdue(testOrders[1].createdAt);
      expect(result).toBeDefined();
    });

    test('應回傳布林值', () => {
      const result = homework.isOrderOverdue(testOrders[1].createdAt);
      expect(typeof result).toBe('boolean');
    });

    test('10 天前應回傳 true', () => {
      const result = homework.isOrderOverdue(testOrders[1].createdAt);
      expect(result).toBe(true);
    });

    test('3 天前應回傳 false', () => {
      const result = homework.isOrderOverdue(testOrders[0].createdAt);
      expect(result).toBe(false);
    });
  });

  describe('getThisWeekOrders', () => {
    test('應有實作（不為 undefined）', () => {
      const result = homework.getThisWeekOrders(testOrders);
      expect(result).toBeDefined();
    });

    test('應回傳陣列', () => {
      const result = homework.getThisWeekOrders(testOrders);
      expect(Array.isArray(result)).toBe(true);
    });

    test('應包含今天的訂單', () => {
      const result = homework.getThisWeekOrders(testOrders);
      const todayOrder = result.find(order => order.id === 'order-3');
      expect(todayOrder).toBeDefined();
    });

    test('不應包含 10 天前的訂單', () => {
      const result = homework.getThisWeekOrders(testOrders);
      const oldOrder = result.find(order => order.id === 'order-2');
      expect(oldOrder).toBeUndefined();
    });
  });
});

// ========================================
// 任務二：資料驗證
// ========================================
describe('任務二：資料驗證', () => {

  describe('validateOrderUser', () => {
    const validUser = {
      name: '王小明',
      tel: '0912345678',
      email: 'test@example.com',
      address: '台北市信義區',
      payment: 'Credit Card'
    };

    const invalidUser = {
      name: '',
      tel: '1234',
      email: 'invalid',
      address: '',
      payment: 'Bitcoin'
    };

    test('應有實作（不為 undefined）', () => {
      const result = homework.validateOrderUser(validUser);
      expect(result).toBeDefined();
    });

    test('有效資料應回傳物件', () => {
      const result = homework.validateOrderUser(validUser);
      expect(typeof result).toBe('object');
      expect(result).not.toBeNull();
    });

    test('有效資料 isValid 應為 true', () => {
      const result = homework.validateOrderUser(validUser);
      expect(result.isValid).toBe(true);
    });

    test('無效資料 isValid 應為 false', () => {
      const result = homework.validateOrderUser(invalidUser);
      expect(result.isValid).toBe(false);
    });

    test('無效資料應有 errors 陣列', () => {
      const result = homework.validateOrderUser(invalidUser);
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('姓名為空應驗證失敗', () => {
      const emptyName = { ...validUser, name: '' };
      const result = homework.validateOrderUser(emptyName);
      expect(result.isValid).toBe(false);
    });

    test('電話格式不正確應驗證失敗', () => {
      const wrongTel = { ...validUser, tel: '1234567890' };
      const result = homework.validateOrderUser(wrongTel);
      expect(result.isValid).toBe(false);
    });

    test('Email 無 @ 應驗證失敗', () => {
      const wrongEmail = { ...validUser, email: 'notanemail' };
      const result = homework.validateOrderUser(wrongEmail);
      expect(result.isValid).toBe(false);
    });

    test('地址為空應驗證失敗', () => {
      const emptyAddress = { ...validUser, address: '' };
      const result = homework.validateOrderUser(emptyAddress);
      expect(result.isValid).toBe(false);
    });

    test('付款方式不在允許清單應驗證失敗', () => {
      const wrongPayment = { ...validUser, payment: 'Bitcoin' };
      const result = homework.validateOrderUser(wrongPayment);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateCartQuantity', () => {
    test('應有實作（不為 undefined）', () => {
      const result = homework.validateCartQuantity(5);
      expect(result).toBeDefined();
    });

    test('應回傳物件', () => {
      const result = homework.validateCartQuantity(5);
      expect(typeof result).toBe('object');
      expect(result).not.toBeNull();
    });

    test('有效數量應驗證成功', () => {
      const result = homework.validateCartQuantity(5);
      expect(result.isValid).toBe(true);
    });

    test('數量 0 應驗證失敗', () => {
      const result = homework.validateCartQuantity(0);
      expect(result.isValid).toBe(false);
    });

    test('數量 100 應驗證失敗', () => {
      const result = homework.validateCartQuantity(100);
      expect(result.isValid).toBe(false);
    });

    test('小數應驗證失敗', () => {
      const result = homework.validateCartQuantity(5.5);
      expect(result.isValid).toBe(false);
    });

  });
});

// ========================================
// 任務三：唯一識別碼
// ========================================
describe('任務三：唯一識別碼', () => {

  describe('generateOrderId', () => {
    test('應有實作（不為 undefined）', () => {
      const result = homework.generateOrderId();
      expect(result).toBeDefined();
    });

    test('應回傳字串', () => {
      const result = homework.generateOrderId();
      expect(typeof result).toBe('string');
    });

    test('應以 ORD- 開頭', () => {
      const result = homework.generateOrderId();
      expect(result.startsWith('ORD-')).toBe(true);
    });

    test('每次產生應不同', () => {
      const id1 = homework.generateOrderId();
      const id2 = homework.generateOrderId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('generateCartItemId', () => {
    test('應有實作（不為 undefined）', () => {
      const result = homework.generateCartItemId();
      expect(result).toBeDefined();
    });

    test('應回傳字串', () => {
      const result = homework.generateCartItemId();
      expect(typeof result).toBe('string');
    });

    test('應以 CART- 開頭', () => {
      const result = homework.generateCartItemId();
      expect(result.startsWith('CART-')).toBe(true);
    });

    test('每次產生應不同', () => {
      const id1 = homework.generateCartItemId();
      const id2 = homework.generateCartItemId();
      expect(id1).not.toBe(id2);
    });
  });
});

// ========================================
// 任務四：Axios API 串接
// ========================================
describe('任務四：Axios API 串接', () => {

  describe('getProductsWithAxios', () => {
    test('應回傳陣列', async () => {
      if (!homework.API_PATH) {
        throw new Error('請先在 .env 設定 API_PATH，才能執行任務四測試');
      }

      const result = await homework.getProductsWithAxios();
      expect(Array.isArray(result)).toBe(true);
    });

    test('應有產品資料', async () => {
      if (!homework.API_PATH) {
        throw new Error('請先在 .env 設定 API_PATH，才能執行任務四測試');
      }

      const result = await homework.getProductsWithAxios();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('addToCartWithAxios', () => {
    test('應回傳物件', async () => {
      if (!homework.API_PATH) {
        throw new Error('請先在 .env 設定 API_PATH，才能執行任務四測試');
      }

      const products = await homework.getProductsWithAxios();
      const productId = products[0].id;
      const result = await homework.addToCartWithAxios(productId, 1);
      expect(typeof result).toBe('object');
      expect(result).not.toBeNull();
    });

    test('應回傳購物車資料', async () => {
      if (!homework.API_PATH) {
        throw new Error('請先在 .env 設定 API_PATH，才能執行任務四測試');
      }

      const products = await homework.getProductsWithAxios();
      const productId = products[0].id;
      const result = await homework.addToCartWithAxios(productId, 1);
      expect(result).toHaveProperty('carts');
    });
  });

  describe('getOrdersWithAxios', () => {
    test('應回傳陣列', async () => {
      if (!homework.API_PATH || !homework.ADMIN_TOKEN) {
        throw new Error('請先在 .env 設定 API_PATH 和 API_KEY，才能執行任務四測試');
      }

      const result = await homework.getOrdersWithAxios();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

// ========================================
// 任務五：OrderService 整合
// ========================================
describe('任務五：OrderService 整合', () => {

  describe('fetchOrders', () => {
    test('應回傳陣列', async () => {
      if (!homework.OrderService.apiPath || !homework.OrderService.token) {
        throw new Error('請先在 .env 設定 API_PATH 和 API_KEY，才能執行任務五測試');
      }

      const result = await homework.OrderService.fetchOrders();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('formatOrders', () => {
    test('應回傳陣列', () => {
      const result = homework.OrderService.formatOrders(testOrders);
      expect(Array.isArray(result)).toBe(true);
    });

    test('應加上 formattedDate 欄位', () => {
      const result = homework.OrderService.formatOrders(testOrders);
      expect(result[0]).toHaveProperty('formattedDate');
    });
  });

  describe('filterUnpaidOrders', () => {
    test('應回傳陣列', () => {
      const result = homework.OrderService.filterUnpaidOrders(testOrders);
      expect(Array.isArray(result)).toBe(true);
    });

    test('應正確篩選未付款訂單（2 筆）', () => {
      const result = homework.OrderService.filterUnpaidOrders(testOrders);
      expect(result.length).toBe(2);
    });
  });

  
});
