import { history } from '@umijs/max';

// 检查认证状态的工具函数
export const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    // 如果没有token，重定向到登录页
    history.push('/login');
    return false;
  }
  return true;
};

// 获取认证token
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// 清除认证信息
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
};