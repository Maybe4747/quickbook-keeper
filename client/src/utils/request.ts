import Login from '@/pages/Login';
import { history } from '@umijs/max';
import { request } from '@umijs/max';
const API_BASE_URL = 'http://localhost:5000/api';

// 登出函数
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  
  // 重定向到登录页
  history.push('/login');
};
// API请求工具函数
export const generateLoginHeader=()=>{
const token = localStorage.getItem('token');
    if (token) {
  return{
    'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
  };
  }else{
    return{
      'Content-Type': 'application/json', 
  }
}
}

// 通用API响应接口
interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

// POST请求
export const post=async(url: string, options?: any)=> {
  const loginHeaders=generateLoginHeader();
  return request(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: loginHeaders,
    ...options,
  })
}
// get请求
export const get=async(url: string, options?: any) => {
  const loginHeaders=generateLoginHeader();
  return request(`${API_BASE_URL}${url}`, {
    method: 'GET',
    headers: loginHeaders,
    ...options,
  })
}

// 通用的PUT请求
export const put=async(url: string, options?: any) => {
  const loginHeaders=generateLoginHeader();
  return request(`${API_BASE_URL}${url}`, {
    method: 'PUT',
    headers: loginHeaders,
    ...options,
  })
}

// 通用的DELETE请求
export const del=async(url: string, options?: any) => {
  const loginHeaders=generateLoginHeader();
  return request(`${API_BASE_URL}${url}`, {
    method: 'DELETE',
    headers: loginHeaders,
    ...options,
  })
}
