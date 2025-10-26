import { post, get, del, put } from '@/utils/request';

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

/**
 * 用户注册
 */
export const registerApi = async (data: RegisterParams): Promise<any> => {
  return await post('/users/register', { data });
};

/**
 * 用户登录
 */
export const loginApi = async (data: LoginParams): Promise<any> => {
  return await post('/users/login', { data });
};

/**
 * 获取用户资料
 */
export const getProfileApi = async (): Promise<any> => {
  return await get('/users/profile');
};

/**
 * 更新用户资料
 */
export const updateProfileApi = async (data: UpdateProfileParams): Promise<any> => {
  return await put('/users/profile', { data });
};