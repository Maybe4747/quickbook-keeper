import { post, get, del, put } from '@/utils/request';
import type { Category } from '../../types/typings';

// 创建分类参数
export interface CreateCategoryParams {
  name: string;
  type: 'expense' | 'income';
}

// 更新分类参数
export interface UpdateCategoryParams {
  name?: string;
  type?: 'expense' | 'income';
}

/**
 * 获取所有分类
 */
export const getCategoriesApi = async (): Promise<any> => {
  return await get('/categories');
};

/**
 * 根据ID获取分类
 */
export const getCategoryByIdApi = async (id: string): Promise<any> => {
  return await get(`/categories/${id}`);
};

/**
 * 创建新分类
 */
export const createCategoryApi = async (data: CreateCategoryParams): Promise<any> => {
  return await post('/categories', { data });
};

/**
 * 更新分类
 */
export const updateCategoryApi = async (id: string, data: UpdateCategoryParams): Promise<any> => {
  return await put(`/categories/${id}`, { data });
};

/**
 * 删除分类
 */
export const deleteCategoryApi = async (id: string): Promise<any> => {
  return await del(`/categories/${id}`);
};

/**
 * 根据类型获取分类
 */
export const getCategoriesByTypeApi = async (type: 'expense' | 'income'): Promise<any> => {
  const response = await get('/categories');
  if (response.code === 0) {
    const filteredCategories = response.data.filter((category: any) => category.type === type);
    return {
      ...response,
      data: filteredCategories
    };
  }
  return response;
};