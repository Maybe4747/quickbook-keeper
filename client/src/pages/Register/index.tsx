import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Row, Col } from 'antd';
import React, { useState } from 'react';
import { history } from '@umijs/max';
import styles from './index.less';

interface RegisterParams {
  username: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: RegisterParams) => {
    const { username, password } = values;
    setLoading(true);

    try {
      // 调用注册API
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.code === 0) {
        message.success('注册成功，请登录');
        // 跳转到登录页面
        history.push('/login');
      } else {
        message.error(data.msg || '注册失败');
      }
    } catch (error) {
      console.error('注册失败:', error);
      message.error('注册失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col xs={20} sm={16} md={12} lg={10} xl={8}>
          <Card title="用户注册" className={styles.registerCard}>
            <Form
              name="register"
              initialValues={{ remember: true }}
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '请输入用户名!' },
                  { min: 3, max: 30, message: '用户名长度应在3-30个字符之间!' },
                ]}
              >
                <Input
                  prefix={<UserOutlined className={styles.prefixIcon} />}
                  placeholder="用户名（3-30个字符）"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码!' },
                  { min: 6, message: '密码长度至少6个字符!' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.prefixIcon} />}
                  type="password"
                  placeholder="密码（至少6个字符）"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  className={styles.registerButton}
                >
                  注册
                </Button>
              </Form.Item>

              <Form.Item>
                <div className={styles.loginLink}>
                  已有账户？ <a href="/login">立即登录</a>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;