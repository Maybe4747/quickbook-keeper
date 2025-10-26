// @ts-nocheck
import { getProfileApi, updateProfileApi, UpdateProfileParams } from '@/services';
import { UserInfo } from '@/types/typings';
import {
  CloseOutlined,
  EditOutlined,
  LockOutlined,
  SaveOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Space,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

const { Title, Text } = Typography;

const UserProfile = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [passwordModalVisible, setPasswordModalVisible] =
    useState<boolean>(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // 初始化加载用户信息
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // 获取用户资料
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await getProfileApi();
      if (response.code === 0) {
        setUser(response.data);
        form.setFieldsValue({
          username: response.data.username,
        });
      } else {
        console.error('获取用户信息失败:', response.msg);
        message.error('获取用户信息失败');
        // 如果获取用户信息失败，可能是token过期，跳转到登录页
        if (response.code === 401) {
          localStorage.removeItem('token');
          history.push('/login');
        }
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      message.error('获取用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 更新用户资料
  const handleUpdateProfile = async (values: any) => {
    setLoading(true);
    try {
      const updateParams: UpdateProfileParams = {
        username: values.username,
      };

      const response = await updateProfileApi(updateParams);
      if (response.code === 0) {
        message.success('用户资料更新成功');
        setUser(response.data);
        setEditMode(false);
      } else {
        console.error('更新用户资料失败:', response.msg);
        message.error(response.msg || '更新用户资料失败');
      }
    } catch (error) {
      console.error('更新用户资料失败:', error);
      message.error('更新用户资料失败');
    } finally {
      setLoading(false);
    }
  };

  // 修改密码
  const handleChangePassword = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      const updateParams: UpdateProfileParams = {
        password: values.newPassword,
      };

      const response = await updateProfileApi(updateParams);
      if (response.code === 0) {
        message.success('密码修改成功');
        setPasswordModalVisible(false);
        passwordForm.resetFields();
      } else {
        console.error('修改密码失败:', response.msg);
        message.error(response.msg || '修改密码失败');
      }
    } catch (error) {
      console.error('修改密码失败:', error);
      message.error('修改密码失败');
    } finally {
      setLoading(false);
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditMode(false);
    form.setFieldsValue({
      username: user?.username,
    });
  };

  // 退出登录
  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出',
      content: '确定要退出登录吗？',
      onOk: () => {
        localStorage.removeItem('token');
        message.success('已退出登录');
        history.push('/login');
      },
    });
  };

  return (
    <div className={styles.container}>
      <Card loading={loading} bordered={false}>
        <Row gutter={24}>
          <Col xs={24} sm={8} md={6}>
            <div className={styles.avatarSection}>
              <Avatar size={120} icon={<UserOutlined />} />
              <Title level={4} style={{ marginTop: 16, textAlign: 'center' }}>
                {user?.username || '用户'}
              </Title>
            </div>
          </Col>

          <Col xs={24} sm={16} md={18}>
            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <Title level={3}>个人信息</Title>
                <Space>
                  {!editMode ? (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => setEditMode(true)}
                    >
                      编辑资料
                    </Button>
                  ) : (
                    <Space>
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={() => form.submit()}
                        loading={loading}
                      >
                        保存
                      </Button>
                      <Button
                        icon={<CloseOutlined />}
                        onClick={handleCancelEdit}
                      >
                        取消
                      </Button>
                    </Space>
                  )}
                </Space>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateProfile}
                disabled={!editMode}
              >
                <Form.Item
                  label="用户名"
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 3, message: '用户名至少3个字符' },
                    { max: 20, message: '用户名最多20个字符' },
                  ]}
                >
                  <Input placeholder="请输入用户名" />
                </Form.Item>
              </Form>

              <Divider />

              <div className={styles.actionSection}>
                <Title level={4}>安全设置</Title>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: '100%' }}
                >
                  <div className={styles.actionItem}>
                    <div>
                      <Text strong>修改密码</Text>
                      <br />
                      <Text type="secondary">定期修改密码，保护账户安全</Text>
                    </div>
                    <Button
                      icon={<LockOutlined />}
                      onClick={() => setPasswordModalVisible(true)}
                    >
                      修改密码
                    </Button>
                  </div>

                  <div className={styles.actionItem}>
                    <div>
                      <Text strong>退出登录</Text>
                      <br />
                      <Text type="secondary">退出当前账户登录</Text>
                    </div>
                    <Button danger onClick={handleLogout}>
                      退出登录
                    </Button>
                  </div>
                </Space>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setPasswordModalVisible(false);
                  passwordForm.resetFields();
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                确认修改
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;
