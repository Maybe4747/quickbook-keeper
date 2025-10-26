import { registerApi } from '@/services';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Button, Card, Form, Input, message, Space, Typography } from 'antd';
import { useState } from 'react';
import styles from './index.less';

const { Title, Link } = Typography;

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: RegisterForm) => {
    setLoading(true);
    try {
      const { username, password } = values;
      const response = await registerApi({ username, password });

      if (response.code === 0) {
        // 注册成功，自动登录
        localStorage.setItem('token', response.data.token!);
        localStorage.setItem('userId', response.data._id);
        localStorage.setItem('username', response.data.username);

        message.success('注册成功！');
        history.push('/home');
      } else {
        message.error(response.msg || '注册失败');
      }
    } catch (error) {
      console.error('注册失败:', error);
      message.error('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    history.push('/login');
  };

  return (
    <div className={styles.registerContainer}>
      <Card className={styles.registerCard}>
        <div className={styles.registerHeader}>
          <Title level={2}>随手记账</Title>
          <p className={styles.registerSubtitle}>创建您的账户，开始记账之旅</p>
        </div>

        <Form
          form={form}
          name="register"
          size="large"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 3, message: '用户名至少3个字符!' },
              { max: 30, message: '用户名不能超过30个字符!' },
              {
                pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
                message: '用户名只能包含字母、数字、下划线和中文!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className={styles.siteFormItemIcon} />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.siteFormItemIcon} />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.siteFormItemIcon} />}
              placeholder="确认密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.registerButton}
              loading={loading}
            >
              注册
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.registerFooter}>
          <Space>
            <span>已有账户？</span>
            <Link onClick={handleLoginClick}>立即登录</Link>
          </Space>
        </div>
      </Card>
    </div>
  );
}
