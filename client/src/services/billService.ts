import { request } from '@/utils/request';
import type { Bill, BillType, Pagination, StatsSummary } from './typings';

const API_BASE_URL = 'http://localhost:5000/api';

// 通用API响应接口
interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

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

class BillService {
  /**
   * 获取账单列表（支持分页和筛选）
   */
  async getBills(
    params: BillQueryParams = {},
  ): Promise<ApiResponse<BillListResponse>> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/bills${queryString ? `?${queryString}` : ''}`;

    const response = await request(url);
    return response.json();
  }

  /**
   * 根据ID获取账单详情
   */
  async getBillById(id: string): Promise<ApiResponse<Bill>> {
    const response = await request(`${API_BASE_URL}/bills/${id}`);
    return response.json();
  }

  /**
   * 创建新账单
   */
  async createBill(params: CreateBillParams): Promise<ApiResponse<Bill>> {
    const response = await request(`${API_BASE_URL}/bills`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response.json();
  }

  /**
   * 更新账单
   */
  async updateBill(
    id: string,
    params: UpdateBillParams,
  ): Promise<ApiResponse<Bill>> {
    const response = await request(`${API_BASE_URL}/bills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(params),
    });
    return response.json();
  }

  /**
   * 删除账单
   */
  async deleteBill(id: string): Promise<ApiResponse<null>> {
    const response = await request(`${API_BASE_URL}/bills/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  /**
   * 获取账单统计摘要
   */
  async getBillSummary(): Promise<ApiResponse<StatsSummary>> {
    const response = await request(`${API_BASE_URL}/bills/summary`);
    return response.json();
  }

  /**
   * 获取最近账单
   */
  async getRecentBills(limit: number = 5): Promise<ApiResponse<Bill[]>> {
    const response = await request(
      `${API_BASE_URL}/bills/recent?limit=${limit}`,
    );
    return response.json();
  }

  /**
   * 获取指定日期范围的账单
   */
  async getBillsByDateRange(
    startDate: string,
    endDate: string,
    params: Omit<BillQueryParams, 'startDate' | 'endDate'> = {},
  ): Promise<ApiResponse<BillListResponse>> {
    return this.getBills({
      ...params,
      startDate,
      endDate,
    });
  }

  /**
   * 根据分类获取账单
   */
  async getBillsByCategory(
    categoryId: string,
    params: Omit<BillQueryParams, 'categoryId'> = {},
  ): Promise<ApiResponse<BillListResponse>> {
    return this.getBills({
      ...params,
      categoryId,
    });
  }

  /**
   * 根据类型获取账单
   */
  async getBillsByType(
    type: BillType,
    params: Omit<BillQueryParams, 'type'> = {},
  ): Promise<ApiResponse<BillListResponse>> {
    return this.getBills({
      ...params,
      type,
    });
  }

  /**
   * 搜索账单（根据备注关键词）
   */
  async searchBills(
    keyword: string,
    params: Omit<BillQueryParams, 'keyword'> = {},
  ): Promise<ApiResponse<BillListResponse>> {
    return this.getBills({
      ...params,
      keyword,
    });
  }
}

export default new BillService();
