import React from 'react';
import { Form, Input, Button, Typography, Card, Flex, Checkbox } from 'antd'; // Importamos Card de antd
import './LoginStyle.css';

const { Title } = Typography;

const Login: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
    // Aquí la lógica de login
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-container">
      <Card className="login-card"> {/* Usamos Card aquí y aplicamos clase login-card */}
        <div className="login-form"> {/*  Este div interno mantiene el centrado del formulario */}
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

            <Form.Item className='mkd'>
              <Flex justify="space-between" align="center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Recuerdame</Checkbox>
                </Form.Item>
                <a href="">Registrate</a>
              </Flex>
              <a href="">¿has olvidado tu contraseña?</a>
            </Form.Item>

            <Form.Item >
              <Button type="primary" htmlType="submit" block>
                Iniciar Sesión
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default Login;