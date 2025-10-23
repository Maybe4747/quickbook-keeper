import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Row, Col } from 'antd';
import React, { useState } from 'react';
import { history, useModel } from '@umijs/max';
import styles from './index.less';

interface LoginParams {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { setInitialState } = useModel('@@initialState');

  const handleSubmit = async (values: LoginParams) => {
    const { username, password } = values;
    setLoading(true);

    try {
      // 调用登录API
      const response = await fetch('/api/users/login', {
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
        // 登录成功，保存token到localStorage
        const { token, _id, username: userName } = data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', _id);
        localStorage.setItem('username', userName);

        // 更新全局状态
        setInitialState({
          userId: _id,
          username: userName,
          token,
          login: true,
        });

        message.success('登录成功');
        // 跳转到首页
        history.push('/home');
      } else {
        message.error(data.msg || '登录失败');
      }
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col xs={20} sm={16} md={12} lg={10} xl={8}>
          <Card title="用户登录" className={styles.loginCard}>
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名!' }]}
              >
                <Input
                  prefix={<UserOutlined className={styles.prefixIcon} />}
                  placeholder="用户名"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.prefixIcon} />}
                  type="password"
                  placeholder="密码"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  className={styles.loginButton}
                >
                  登录
                </Button>
              </Form.Item>

              <Form.Item>
                <div className={styles.registerLink}>
                  还没有账户？ <a href="/register">立即注册</a>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;