// @ts-nocheck
import { categoryService } from '@/services';
import { BillType, Category } from '@/types/typings';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Space,
  Table,
  Tabs,
  Tag,
} from 'antd';
import { useEffect, useState } from 'react';

const { TabPane } = Tabs;

const Categories = () => {
  // 状态变量
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [activeTab, setActiveTab] = useState<string>(BillType.EXPENSE);

  const [form] = Form.useForm();

  // 初始化加载
  useEffect(() => {
    fetchCategories();
  }, []);

  // 获取分类列表
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getCategories();
      if (response.code === 0) {
        setCategories(response.data);
      } else {
        console.error('获取分类列表失败:', response.msg);
        message.error('获取分类列表失败');
      }
    } catch (error) {
      console.error('获取分类列表失败:', error);
      message.error('获取分类列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理新增分类
  const handleCreate = () => {
    setModalType('create');
    setEditingCategory(null);
    form.resetFields();
    form.setFieldsValue({ type: activeTab });
    setModalVisible(true);
  };

  // 处理编辑分类
  const handleEdit = (record: Category) => {
    setModalType('edit');
    setEditingCategory(record);
    form.setFieldsValue({
      name: record.name,
      type: record.type,
      icon: record.icon || '',
    });
    setModalVisible(true);
  };

  // 处理删除分类
  const handleDelete = async (id: string) => {
    try {
      const response = await categoryService.deleteCategory(id);
      if (response.code === 0) {
        message.success('分类删除成功');
        // 重新获取分类列表
        fetchCategories();
      } else {
        console.error('删除分类失败:', response.msg);
        message.error(response.msg || '删除分类失败');
      }
    } catch (error) {
      console.error('删除分类失败:', error);
      message.error('删除分类失败');
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      let response;
      if (modalType === 'create') {
        response = await categoryService.createCategory(values);
      } else if (modalType === 'edit' && editingCategory) {
        response = await categoryService.updateCategory(
          editingCategory._id!,
          values,
        );
      }

      if (response && response.code === 0) {
        message.success(
          modalType === 'create' ? '分类创建成功' : '分类更新成功',
        );
        setModalVisible(false);
        // 重新获取分类列表
        fetchCategories();
      } else {
        console.error('表单提交失败:', response?.msg);
        message.error(response?.msg || '操作失败');
      }
    } catch (error) {
      console.error('表单提交失败:', error);
      message.error('操作失败');
    }
  };

  // 过滤当前类型的分类
  const getCurrentTypeCategories = () => {
    return categories.filter((category) => category.type === activeTab);
  };

  // 表格列配置
  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => (
        <Tag color={text === BillType.INCOME ? 'green' : 'red'}>
          {text === BillType.INCOME ? '收入' : '支出'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Category) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个分类吗？"
            onConfirm={() => record._id && handleDelete(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div>
      <Card
        title="分类管理"
        bordered={false}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新增分类
          </Button>
        }
      >
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="支出分类" key={BillType.EXPENSE} />
          <TabPane tab="收入分类" key={BillType.INCOME} />
        </Tabs>

        <Table
          rowKey="_id"
          dataSource={getCurrentTypeCategories()}
          columns={columns}
          loading={loading}
          pagination={false}
        />
      </Card>

      <Modal
        title={modalType === 'create' ? '新增分类' : '编辑分类'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSubmit}
          >
            保存
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="分类名称"
            rules={[
              { required: true, message: '请输入分类名称' },
              { max: 20, message: '分类名称不能超过20个字符' },
            ]}
          >
            <Input placeholder="请输入分类名称" maxLength={20} />
          </Form.Item>

          <Form.Item
            name="type"
            label="分类类型"
            rules={[{ required: true, message: '请选择分类类型' }]}
          >
            <Radio.Group>
              <Radio.Button value={BillType.EXPENSE}>支出</Radio.Button>
              <Radio.Button value={BillType.INCOME}>收入</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="icon" label="图标 (可选)">
            <Input placeholder="请输入图标名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
