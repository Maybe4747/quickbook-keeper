import { request } from '@/utils/request';
import type { Category } from '../types/typings';

const API_BASE_URL = 'http://localhost:5000/api';

// 通用API响应接口
interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

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

class CategoryService {
  /**
   * 获取所有分类
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await request(`${API_BASE_URL}/categories`);
    return response.json();
  }

  /**
   * 根据ID获取分类
   */
  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    const response = await request(`${API_BASE_URL}/categories/${id}`);
    return response.json();
  }

  /**
   * 创建新分类
   */
  async createCategory(
    params: CreateCategoryParams,
  ): Promise<ApiResponse<Category>> {
    const response = await request(`${API_BASE_URL}/categories`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response.json();
  }

  /**
   * 更新分类
   */
  async updateCategory(
    id: string,
    params: UpdateCategoryParams,
  ): Promise<ApiResponse<Category>> {
    const response = await request(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(params),
    });
    return response.json();
  }

  /**
   * 删除分类
   */
  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    const response = await request(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  /**
   * 根据类型获取分类
   */
  async getCategoriesByType(
    type: 'expense' | 'income',
  ): Promise<ApiResponse<Category[]>> {
    const result = await this.getCategories();
    if (result.code === 0) {
      const filteredCategories = result.data.filter(
        (category: Category) => category.type === type,
      );
      return {
        ...result,
        data: filteredCategories,
      };
    }
    return result;
  }
}

export default new CategoryService();
