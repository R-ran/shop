import axios from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';
import invariant from 'tiny-invariant';

// 获取 API 端点 - 构建时使用默认值，运行时检查并提示
const getApiEndpoint = () => {
  const endpoint = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  
  // 如果设置了有效的端点，直接返回
  if (endpoint && endpoint.trim() !== '') {
    return endpoint;
  }
  
  // 开发环境使用 localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api';
  }
  
  // 构建时返回占位符，让构建通过
  // 运行时会在拦截器中检查并提示
  if (typeof window === 'undefined') {
    return 'http://localhost:5000/api'; // SSR 时使用默认值，避免构建失败
  }
  
  // 客户端运行时，如果未设置，返回空字符串，由拦截器处理
  return '';
};

const API_ENDPOINT = getApiEndpoint();
const Axios = axios.create({
  baseURL: API_ENDPOINT || 'http://localhost:5000/api', // 提供默认值避免创建失败
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Change request data/error
const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? 'authToken';

// 在请求拦截器中检查 API 端点配置（仅在客户端运行时）
Axios.interceptors.request.use((config) => {
  // 客户端运行时检查 API 端点配置
  if (typeof window !== 'undefined') {
    const endpoint = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
    if (!endpoint || endpoint.trim() === '' || endpoint === 'http://localhost:5000/api') {
      // 只在第一次请求时显示错误，避免重复提示
      if (!(window as any).__API_ENDPOINT_WARNING_SHOWN) {
        (window as any).__API_ENDPOINT_WARNING_SHOWN = true;
        console.error(
          '%c❌ API 端点未配置',
          'color: red; font-size: 16px; font-weight: bold;',
          '\n\n请在部署平台设置环境变量:',
          '\nNEXT_PUBLIC_REST_API_ENDPOINT=https://your-api-domain.com/api',
          '\n\n然后重新部署应用。'
        );
      }
    }
  }

  const cookies = Cookies.get(AUTH_TOKEN_KEY);
  let token = '';
  if (cookies) {
    token = JSON.parse(cookies)['token'];
  }
  // @ts-ignore
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
  };
  return config;
});

// Change response data/error here
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      (error.response && error.response.status === 403) ||
      (error.response &&
        error.response.data.message === 'PICKBAZAR_ERROR.NOT_AUTHORIZED')
    ) {
      Cookies.remove(AUTH_TOKEN_KEY);
      Router.reload();
    }
    return Promise.reject(error);
  },
);

function formatBooleanSearchParam(key: string, value: boolean) {
  return value ? `${key}:1` : `${key}:`;
}

interface SearchParamOptions {
  categories: string;
  code: string;
  type: string;
  name: string;
  shop_id: string;
  is_approved: boolean;
  tracking_number: string;
  notice: string;
  notify_type: string;
  faq_title: string;
  is_active: boolean;
  title: string;
  status: string;
  user_id: string;
  target: string;
  refund_reason: string;
  shops: string;
  'users.id': string;
  product_type: string;
  is_read: boolean;
  transaction_identifier: string;
}

export class HttpClient {
  static async get<T>(url: string, params?: unknown) {
    const response = await Axios.get<T>(url, { params });
    return response.data;
  }

  static async post<T>(url: string, data: unknown, options?: any) {
    const response = await Axios.post<T>(url, data, options);
    return response.data;
  }

  static async put<T>(url: string, data: unknown) {
    const response = await Axios.put<T>(url, data);
    return response.data;
  }

  static async delete<T>(url: string) {
    const response = await Axios.delete<T>(url);
    return response.data;
  }

  static formatSearchParams(params: Partial<SearchParamOptions>) {
    return Object.entries(params)
      .filter(([, value]) => Boolean(value))
      .map(([k, v]) =>
        [
          'type',
          'categories',
          'tags',
          'author',
          'manufacturer',
          'shops',
          'refund_reason',
        ].includes(k)
          ? `${k}.slug:${v}`
          : ['is_approved'].includes(k)
          ? formatBooleanSearchParam(k, v as boolean)
          : `${k}:${v}`,
      )
      .join(';');
  }
}

export function getFormErrors(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data.message;
  }
  return null;
}

export function getFieldErrors(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data.errors;
  }
  return null;
}
