import { cache } from './cache';

// API на российском VPS через HTTPS (работает из России без VPN)
const API_URL = 'https://mactabak-api.ru/api';

// Получить все категории (с кешированием)
export const getCategories = async () => {
  const cacheKey = 'categories';
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('[API] Using cached categories');
    return cached;
  }

  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');

  const data = await response.json();
  cache.set(cacheKey, data, 10 * 60 * 1000); // Кеш на 10 минут
  return data;
};

// Получить все товары (с кешированием)
export const getProducts = async (categoryId = null) => {
  const cacheKey = categoryId ? `products_cat_${categoryId}` : 'products_all';
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('[API] Using cached products');
    return cached;
  }

  let url = `${API_URL}/products`;
  if (categoryId) {
    url += `?category_id=${categoryId}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch products');

  const data = await response.json();
  cache.set(cacheKey, data, 5 * 60 * 1000); // Кеш на 5 минут
  return data;
};

// Получить один товар
export const getProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');

  const data = await response.json();
  return data;
};

// Получить настройки магазина (с кешированием)
export const getShopSettings = async () => {
  const cacheKey = 'shop_settings';
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('[API] Using cached shop settings');
    return cached;
  }

  const response = await fetch(`${API_URL}/shop-settings`);
  if (!response.ok) throw new Error('Failed to fetch shop settings');

  const data = await response.json();
  cache.set(cacheKey, data, 30 * 60 * 1000); // Кеш на 30 минут
  return data;
};

// Создать или обновить пользователя
export const upsertUser = async (userData) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) throw new Error('Failed to upsert user');

  const data = await response.json();
  return data;
};

// Создать заказ
export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });

  if (!response.ok) throw new Error('Failed to create order');

  const data = await response.json();
  return data;
};

// Получить заказы (для админки)
export const getOrders = async () => {
  const response = await fetch(`${API_URL}/orders`);
  if (!response.ok) throw new Error('Failed to fetch orders');

  const data = await response.json();
  return data;
};
