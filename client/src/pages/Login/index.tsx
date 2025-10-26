import { loginApi } from '@/services';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Button, Card, Form, Input, message, Space, Typography } from 'antd';
import { useState } from 'react';
import styles from './index.less';

const { Title, Link } = Typography;

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const response = await loginApi(values);

      if (response.code === 0) {
        // 登录成功
        localStorage.setItem('token', response.data.token!);
        localStorage.setItem('userId', response.data._id);
        localStorage.setItem('username', response.data.username);

        message.success('登录成功！');
        history.push('/home');
      } else {
        message.error(response.msg || '登录失败');
      }
    } catch (error) {
      console.error('登录失败:', error);
      message.error('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    history.push('/register');
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <Title level={2}>随手记账</Title>
          <p className={styles.loginSubtitle}>欢迎回来，请登录您的账户</p>
        </div>

        <Form
          form={form}
          name="login"
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.loginButton}
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.loginFooter}>
          <Space>
            <span>还没有账户？</span>
            <Link onClick={handleRegisterClick}>立即注册</Link>
          </Space>
        </div>
      </Card>
    </div>
  );
}
