import { Bill, BillType } from '@/services/typings';
import {
  AccountBookOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Alert, Button, Card, Col, Row, Spin, Statistic, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

const HomePage: React.FC = () => {
  // 状态变量
  const [loading, setLoading] = useState<boolean>(true);
  const [summaryData, setSummaryData] = useState<{
    expense: number;
    income: number;
    balance: number;
  }>({
    expense: 0,
    income: 0,
    balance: 0,
  });
  const [recentBills, setRecentBills] = useState<Bill[]>([]);

  // 初始化加载
  useEffect(() => {
    fetchSummaryData();
    fetchRecentBills();
  }, []);

  // 获取统计摘要数据
  const fetchSummaryData = async () => {
    setLoading(true);
    try {
      // TODO: 在这里添加实际的API调用
      console.log('获取统计摘要数据');
    } catch (error) {
      console.error('获取账单统计摘要失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取近期账单
  const fetchRecentBills = async () => {
    try {
      // TODO: 在这里添加实际的API调用
      console.log('获取近期账单数据');
    } catch (error) {
      console.error('获取近期账单失败:', error);
    }
  };

  // 刷新数据
  const handleRefresh = () => {
    fetchSummaryData();
    fetchRecentBills();
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 表格列配置
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => formatDate(text),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => (
        <span className={text === BillType.INCOME ? 'income' : 'expense'}>
          {text === BillType.INCOME ? '收入' : '支出'}
        </span>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number, record: Bill) => (
        <span
          className={record.type === BillType.INCOME ? 'income' : 'expense'}
        >
          {record.type === BillType.INCOME ? '+' : '-'}
          {text.toFixed(2)}
        </span>
      ),
    },
    {
      title: '分类',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (category: any) => {
        if (typeof category === 'string') {
          return '未知分类';
        }
        return category?.name || '未知分类';
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (text: string) => text || '-',
    },
  ];

  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Card
          bordered={false}
          title="本月财务概览"
          extra={
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              刷新
            </Button>
          }
        >
          <Spin spinning={loading}>
            <Row gutter={16} className={styles.statsRow}>
              <Col xs={24} sm={8}>
                <Card bordered={false}>
                  <Statistic
                    title="本月支出"
                    value={summaryData.expense}
                    precision={2}
                    valueStyle={{ color: '#cf1322' }}
                    prefix="¥"
                    suffix={<ArrowDownOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card bordered={false}>
                  <Statistic
                    title="本月收入"
                    value={summaryData.income}
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                    prefix="¥"
                    suffix={<ArrowUpOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card bordered={false}>
                  <Statistic
                    title="本月结余"
                    value={summaryData.balance}
                    precision={2}
                    valueStyle={{
                      color: summaryData.balance >= 0 ? '#3f8600' : '#cf1322',
                    }}
                    prefix="¥"
                    suffix={<AccountBookOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </Spin>
        </Card>

        <Card bordered={false} style={{ marginTop: 16 }} title="近期账单">
          {recentBills.length > 0 ? (
            <Table
              rowKey="_id"
              dataSource={recentBills}
              columns={columns}
              pagination={false}
            />
          ) : (
            <Alert
              message="暂无账单数据"
              type="info"
              showIcon
              description="去记录您的第一笔账单吧！"
            />
          )}
        </Card>
      </div>
    </PageContainer>
  );
};

export default HomePage;
