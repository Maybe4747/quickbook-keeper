import { request } from '@/utils/request';
const API_BASE_URL = 'http://localhost:5000/api';

// 通用API响应接口
interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

// 用户接口
export interface User {
  _id: string;
  username: string;
  token?: string;
}

// 注册请求参数
export interface RegisterParams {
  username: string;
  password: string;
}

// 登录请求参数
export interface LoginParams {
  username: string;
  password: string;
}

// 更新用户资料参数
export interface UpdateProfileParams {
  username?: string;
  password?: string;
}

class UserService {
  /**
   * 用户注册
   */
  async register(params: RegisterParams): Promise<ApiResponse<User>> {
    const response = await request(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response.json();
  }

  /**
   * 用户登录
   */
  async login(params: LoginParams): Promise<ApiResponse<User>> {
    const response = await request(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response.json();
  }

  /**
   * 获取用户资料
   */
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await request(`${API_BASE_URL}/users/profile`);
    return response.json();
  }

  /**
   * 更新用户资料
   */
  async updateProfile(params: UpdateProfileParams): Promise<ApiResponse<User>> {
    const response = await request(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      body: JSON.stringify(params),
    });
    return response.json();
  }
}

export default new UserService();
