import { post, get, del, put } from '@/utils/request';
import type { Bill, BillType, Pagination, StatsSummary, QueryParams } from '../../types/typings';

// 账单列表响应数据
export interface BillListResponse {
  list: Bill[];
  pagination: Pagination;
  stats: {
    totalIncome: number;
    totalExpense: number;
  };
}

// 创建账单参数
export interface CreateBillParams {
  amount: number;
  type: BillType;
  categoryId: string;
  date: string | Date;
  note?: string;
}

// 更新账单参数
export interface UpdateBillParams {
  amount?: number;
  type?: BillType;
  categoryId?: string;
  date?: string | Date;
  note?: string;
}

// 账单查询参数
export interface BillQueryParams {
  page?: number;
  limit?: number;
  type?: BillType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
}

/**
 * 获取账单列表（支持分页和筛选）
 */
export const getBillsApi = async (data: BillQueryParams): Promise<any> => {
  // 构建查询参数字符串
  const searchParams = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const url = `/bills${queryString ? `?${queryString}` : ''}`;
  return await get(url);
};

/**
 * 根据ID获取账单详情
 */
export const getBillByIdApi = async (id: string): Promise<any> => {
  return await get(`/bills/${id}`);
};

/**
 * 创建新账单
 */
export const createBillApi = async (data: CreateBillParams): Promise<any> => {
  return await post('/bills', { data });
};

/**
 * 更新账单
 */
export const updateBillApi = async (id: string, data: UpdateBillParams): Promise<any> => {
  return await put(`/bills/${id}`, { data });
};

/**
 * 删除账单
 */
export const deleteBillApi = async (id: string): Promise<any> => {
  return await del(`/bills/${id}`);
};

/**
 * 获取账单统计摘要
 */
export const getBillSummaryApi = async (): Promise<any> => {
  return await get('/bills/summary');
};

/**
 * 获取最近账单
 */
export const getRecentBillsApi = async (limit: number = 5): Promise<any> => {
  return await get(`/bills/recent?limit=${limit}`);
};

/**
 * 获取指定日期范围的账单
 */
export const getBillsByDateRangeApi = async (
  startDate: string,
  endDate: string,
  params?: Omit<BillQueryParams, 'startDate' | 'endDate'>
): Promise<any> => {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
  }
  
  searchParams.append('startDate', startDate);
  searchParams.append('endDate', endDate);
  
  const queryString = searchParams.toString();
  const url = `/bills${queryString ? `?${queryString}` : ''}`;
  return await get(url);
};

/**
 * 根据分类获取账单
 */
export const getBillsByCategoryApi = async (
  categoryId: string,
  params?: Omit<BillQueryParams, 'categoryId'>
): Promise<any> => {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
  }
  
  searchParams.append('categoryId', categoryId);
  
  const queryString = searchParams.toString();
  const url = `/bills${queryString ? `?${queryString}` : ''}`;
  return await get(url);
};

/**
 * 根据类型获取账单
 */
export const getBillsByTypeApi = async (
  type: BillType,
  params?: Omit<BillQueryParams, 'type'>
): Promise<any> => {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
  }
  
  searchParams.append('type', type);
  
  const queryString = searchParams.toString();
  const url = `/bills${queryString ? `?${queryString}` : ''}`;
  return await get(url);
};

/**
 * 搜索账单（根据备注关键词）
 */
export const searchBillsApi = async (
  keyword: string,
  params?: Omit<BillQueryParams, 'keyword'>
): Promise<any> => {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
  }
  
  searchParams.append('keyword', keyword);
  
  const queryString = searchParams.toString();
  const url = `/bills${queryString ? `?${queryString}` : ''}`;
  return await get(url);
};

