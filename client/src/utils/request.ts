import { history } from '@umijs/max';

// API请求工具函数
export const request = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // 如果响应状态码为401（未授权），则跳转到登录页
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    history.push('/login');
    return response;
  }
  
  return response;
};

// 登出函数
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  
  // 重定向到登录页
  history.push('/login');
};