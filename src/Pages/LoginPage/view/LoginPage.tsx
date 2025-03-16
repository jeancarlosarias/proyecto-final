import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, Checkbox, message } from 'antd';
import './LoginStyle.css';
import { Link, useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

const fakeLogin = (username: string, password: string): Promise<LoginResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        resolve({ success: true, token: 'fake-token-123' });
      } else {
        resolve({ success: false, message: 'Invalid username or password' });
      }
    }, 1000);
  });
};

interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    const response = await fakeLogin(values.username, values.password);
    setLoading(false);

    if (response.success && response.token) {
      if (values.remember) {
        localStorage.setItem('token', response.token);
      } else {
        sessionStorage.setItem('token', response.token);
      }
      navigate('/');
    } else {
      message.error(response.message || 'Login failed');
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
          Iniciar Sesión
        </Title>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Usuario"
            name="username"
            rules={[{ required: true, message: 'Por favor, ingresa tu usuario!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Por favor, ingresa tu contraseña!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Recuerdame</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Iniciar Sesión
            </Button>
            
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/Registro">Registrate</Link>
          <span style={{ margin: '0 8px' }}>|</span>
          <a href="">¿has olvidado tu contraseña?</a>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;