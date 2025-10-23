import { billService, categoryService } from '@/services';
import { Bill, BillType, Category, Pagination } from '@/services/typings';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
} from 'antd';
import React, { useEffect, useState } from 'react';
// 引入样式
import './index.less';
// 我们将使用标准Date对象格式化日期

const { RangePicker } = DatePicker;

// 每个表格列的配置
interface TableColumn {
  title: string;
  dataIndex: string;
  key: string;
  render?: (text: any, record: Bill) => React.ReactNode;
}

const BillList = () => {
  // 状态变量
  const [bills, setBills] = useState<Bill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  const [form] = Form.useForm();
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);

  // 初始化加载
  useEffect(() => {
    fetchCategories();
    fetchBills();
  }, []);

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      if (response.code === 0) {
        setCategories(response.data);
      } else {
        console.error('获取分类列表失败:', response.msg);
      }
    } catch (error) {
      console.error('获取分类列表失败:', error);
    }
  };

  // 获取账单列表
  const fetchBills = async (filters: any = {}) => {
    setLoading(true);
    try {
      const queryParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters,
      };

      const response = await billService.getBills(queryParams);

      if (response.code === 0) {
        setBills(response.data.list);
        setPagination({
          ...pagination,
          total: response.data.pagination.total,
          current: response.data.pagination.current,
          pageSize: response.data.pagination.pageSize,
        });
      } else {
        console.error('获取账单列表失败:', response.msg);
        message.error('获取账单列表失败');
      }
    } catch (error) {
      console.error('获取账单列表失败:', error);
      message.error('获取账单列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 筛选查询
  const handleSearch = (values: any) => {
    const { dateRange, type, categoryId, keyword } = values;

    const filters: any = {};

    if (dateRange && dateRange[0] && dateRange[1]) {
      filters.startDate = dateRange[0].format('YYYY-MM-DD');
      filters.endDate = dateRange[1].format('YYYY-MM-DD');
    }

    if (type) {
      filters.type = type;
    }

    if (categoryId) {
      filters.categoryId = categoryId;
    }

    if (keyword) {
      filters.keyword = keyword;
    }

    // 重置页码为1
    setPagination({
      ...pagination,
      current: 1,
    });

    fetchBills(filters);
  };

  // 重置筛选
  const handleReset = () => {
    form.resetFields();

    setPagination({
      ...pagination,
      current: 1,
    });

    fetchBills();
  };

  // 处理页码变化
  const handlePageChange = (page: number, pageSize?: number) => {
    const newPagination = {
      ...pagination,
      current: page,
      pageSize: pageSize || pagination.pageSize,
    };

    setPagination(newPagination);
    fetchBills();
  };

  // 跳转到新增账单页面
  const goToAddBill = () => {
    history.push('/bills/new');
  };

  // 跳转到编辑账单页面
  const goToEditBill = (id: string) => {
    history.push(`/bills/edit/${id}`);
  };

  // 删除账单
  const handleDeleteBill = async (id: string) => {
    try {
      const response = await billService.deleteBill(id);

      if (response.code === 0) {
        message.success('账单删除成功');
        // 重新获取账单列表
        fetchBills();
      } else {
        console.error('删除账单失败:', response.msg);
        message.error('删除账单失败');
      }
    } catch (error) {
      console.error('删除账单失败:', error);
      message.error('删除账单失败');
    }
  };

  // 格式化日期函数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 表格列配置
  const columns: TableColumn[] = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (text) => formatDate(text),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => (
        <span
          className={record.type === BillType.INCOME ? 'income' : 'expense'}
        >
          {record.type === BillType.INCOME ? '+' : '-'}
          {text.toFixed(2)}
        </span>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => (
        <Tag color={text === BillType.INCOME ? 'green' : 'red'}>
          {text === BillType.INCOME ? '收入' : '支出'}
        </Tag>
      ),
    },
    {
      title: '分类',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (category) => {
        if (typeof category === 'string') {
          const foundCategory = categories.find((c) => c._id === category);
          return foundCategory ? foundCategory.name : '-';
        }
        return category?.name || '-';
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (text) => text || '-',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => record._id && goToEditBill(record._id)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条账单吗？"
            onConfirm={() => record._id && handleDeleteBill(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card title="账单列表" bordered={false}>
        <Form
          form={form}
          layout="horizontal"
          onFinish={handleSearch}
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="dateRange" label="日期范围">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="type" label="账单类型">
                <Select placeholder="请选择账单类型" allowClear>
                  <Select.Option value={BillType.INCOME}>收入</Select.Option>
                  <Select.Option value={BillType.EXPENSE}>支出</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="categoryId" label="账单分类">
                <Select placeholder="请选择账单分类" allowClear>
                  {categories.map((category) => (
                    <Select.Option key={category._id} value={category._id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="keyword" label="关键词">
                <Input placeholder="请输入备注关键词" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  htmlType="submit"
                >
                  查询
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={goToAddBill}
                >
                  新增账单
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="当前页收入"
                value={totalIncome}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix="¥"
                suffix={<ArrowUpOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="当前页支出"
                value={totalExpense}
                precision={2}
                valueStyle={{ color: '#cf1322' }}
                prefix="¥"
                suffix={<ArrowDownOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="当前页结余"
                value={totalIncome - totalExpense}
                precision={2}
                valueStyle={{
                  color:
                    totalIncome - totalExpense >= 0 ? '#3f8600' : '#cf1322',
                }}
                prefix="¥"
              />
            </Card>
          </Col>
        </Row>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={bills}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: handlePageChange,
          }}
        />
      </Card>
    </div>
  );
};

export default BillList;
