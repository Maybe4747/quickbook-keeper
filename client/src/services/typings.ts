// 账单类型（收入/支出）
export enum BillType {
  EXPENSE = 'expense', // 支出
  INCOME = 'income', // 收入
}

// 账单分类接口
export interface Category {
  _id?: string; // 分类ID
  name: string; // 分类名称（例如：餐饮、交通、工资等）
  type: BillType; // 类型（收入或支出）
  icon?: string; // 图标（可选）
  createdAt?: Date; // 创建时间
  updatedAt?: Date; // 更新时间
}

// 账单接口
export interface Bill {
  _id?: string; // 账单ID
  amount: number; // 金额
  type: BillType; // 类型（收入或支出）
  categoryId: string; // 分类ID
  category?: Category; // 分类信息（可选，用于关联查询）
  date: Date | string; // 日期
  note?: string; // 备注
  createdAt?: Date; // 创建时间
  updatedAt?: Date; // 更新时间
}

// 分页接口
export interface Pagination {
  current: number; // 当前页码
  pageSize: number; // 每页数量
  total: number; // 总数据条数
}

// 查询参数接口
export interface QueryParams {
  page?: number; // 页码
  limit?: number; // 每页数量
  type?: BillType; // 类型筛选（收入或支出）
  categoryId?: string; // 分类筛选
  startDate?: Date | string; // 开始日期
  endDate?: Date | string; // 结束日期
  keyword?: string; // 关键词搜索
}

// 统计数据接口
export interface StatsSummary {
  expense: number; // 总支出
  income: number; // 总收入
  balance: number; // 结余（收入-支出）
}
