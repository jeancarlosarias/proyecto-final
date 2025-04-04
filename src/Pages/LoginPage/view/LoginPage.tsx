import React, { useState } from "react";
import { Form, Input, Button, Typography, Card, Checkbox, message } from "antd";
import "./LoginStyle.css";
import { Link, useNavigate } from "react-router-dom";

const url = "https://localhost:7068/api/Login/";

const { Title } = Typography;

interface LoginResponse {
  success: boolean;
  message: string;
  result: boolean;
}

const realLogin = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        clientEmail: username,
        clientPassword: password,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al conectar con el servidor",
      result: false,
    };
  }
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
    const response = await realLogin(values.username, values.password);
    setLoading(false);

    if (response.success && response.result) {
      if (values.remember) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", values.username);
      } else {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("username", values.username);
      }
      message.success("¡Inicio de sesión exitoso!");
      navigate("/inicio");
    } else {
      message.error(response.message || "No se pudo iniciar sesión");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
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
            rules={[
              { required: true, message: "Por favor, ingresa tu usuario!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { required: true, message: "Por favor, ingresa tu contraseña!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Recuérdame</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Link to="/Registro">Regístrate</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
