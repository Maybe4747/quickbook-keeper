import { BillType, Category } from '@/services/typings';
import {
  CloseOutlined,
  PlusOutlined,
  RollbackOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { history, useParams } from '@umijs/max';
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Select,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

const BillForm: React.FC = () => {
  // 状态变量
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedType, setSelectedType] = useState<BillType>(BillType.EXPENSE);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // 获取路由参数(编辑时会有ID)
  const params = useParams<{ id: string }>();
  const id = params.id;

  // 新增分类弹窗状态
  const [showAddCategory, setShowAddCategory] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [addingCategory, setAddingCategory] = useState<boolean>(false);

  // 初始化加载
  useEffect(() => {
    // 初始化分类列表
    fetchCategories();

    // 如果是编辑模式，获取账单详情
    if (id) {
      setIsEdit(true);
      fetchBillDetail(id);
    } else {
      // 设置默认账单类型
      setSelectedType(BillType.EXPENSE);
    }
  }, [id]);

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      // TODO: 在这里添加实际的API调用
      console.log('获取分类列表');
    } catch (error) {
      console.error('获取分类列表失败:', error);
      message.error('获取分类列表失败');
    }
  };

  // 获取账单详情(编辑模式)
  const fetchBillDetail = async (billId: string) => {
    setLoading(true);
    try {
      // TODO: 在这里添加实际的API调用
      console.log('获取账单详情', billId);
    } catch (error) {
      console.error('获取账单详情失败:', error);
      message.error('获取账单详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    setSubmitLoading(true);
    try {
      const formattedValues = {
        ...values,
        date: values.date
          ? dayjs(values.date).toISOString()
          : dayjs().toISOString(), // 确保使用 day.js
      };

      // TODO: 在这里添加实际的API调用来保存账单
      console.log(isEdit ? '更新账单:' : '创建账单:', formattedValues);

      // 模拟成功操作
      message.success(isEdit ? '账单更新成功' : '账单创建成功');
      // TODO: 添加页面跳转逻辑
      // history.push('/bills'); // 返回账单列表页
    } catch (error) {
      console.error(isEdit ? '更新账单失败:' : '创建账单失败:', error);
      message.error(isEdit ? '更新账单失败' : '创建账单失败');
    } finally {
      setSubmitLoading(false);
    }
  };

  // 处理账单类型变更
  const handleTypeChange = (value: BillType) => {
    setSelectedType(value);
    form.setFieldsValue({ categoryId: undefined }); // 清空已选的分类
  };

  // 返回列表页
  const goBack = () => {
    history.push('/bills');
  };

  // 添加新分类
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      message.error('请输入分类名称');
      return;
    }

    setAddingCategory(true);
    try {
      // TODO: 在这里添加实际的API调用来创建分类
      console.log('创建分类:', {
        name: newCategoryName.trim(),
        type: selectedType,
      });

      // 模拟成功操作
      message.success('分类添加成功');
      setNewCategoryName('');
      setShowAddCategory(false);

      // TODO: 重新获取分类列表
      await fetchCategories();
    } catch (error) {
      console.error('添加分类失败:', error);
      message.error('添加分类失败');
    } finally {
      setAddingCategory(false);
    }
  };

  // 获取当前类型的分类列表
  const getCurrentTypeCategories = () => {
    if (!categories || categories.length === 0) {
      console.warn('分类列表为空或未初始化');
      return [];
    }
    return categories.filter((category) => category.type === selectedType);
  };

  return (
    <div>
      <Card
        title={isEdit ? '编辑账单' : '新增账单'}
        bordered={false}
        loading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: BillType.EXPENSE,
            date: dayjs(), // 使用 day.js 初始化日期
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="type"
            label="账单类型"
            rules={[{ required: true, message: '请选择账单类型' }]}
          >
            <Radio.Group onChange={(e) => handleTypeChange(e.target.value)}>
              <Radio.Button value={BillType.EXPENSE}>支出</Radio.Button>
              <Radio.Button value={BillType.INCOME}>收入</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="amount"
            label="金额"
            rules={[
              { required: true, message: '请输入金额' },
              { type: 'number', min: 0.01, message: '金额必须大于0' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入金额"
              precision={2}
              min={0.01}
              step={1}
              prefix={selectedType === BillType.EXPENSE ? '-' : '+'}
            />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <div>
              {showAddCategory ? (
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    placeholder="请输入新分类名称"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    disabled={addingCategory}
                  />
                  <Button
                    type="primary"
                    onClick={handleAddCategory}
                    loading={addingCategory}
                    icon={<SaveOutlined />}
                  >
                    保存
                  </Button>
                  <Button
                    onClick={() => setShowAddCategory(false)}
                    icon={<CloseOutlined />}
                  >
                    取消
                  </Button>
                </Space.Compact>
              ) : (
                <Space.Compact style={{ width: '100%' }}>
                  <Select
                    style={{ width: '85%' }}
                    placeholder="请选择分类"
                    options={getCurrentTypeCategories().map((category) => ({
                      label: category.name,
                      value: category._id,
                    }))}
                  />
                  <Button
                    onClick={() => setShowAddCategory(true)}
                    icon={<PlusOutlined />}
                  >
                    新增
                  </Button>
                </Space.Compact>
              )}
            </div>
          </Form.Item>

          <Form.Item
            name="date"
            label="日期"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea
              placeholder="请输入备注(选填)"
              rows={3}
              maxLength={100}
              showCount
            />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitLoading}
                icon={<SaveOutlined />}
              >
                {isEdit ? '保存修改' : '保存'}
              </Button>
              <Button onClick={goBack} icon={<RollbackOutlined />}>
                返回
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default BillForm;
