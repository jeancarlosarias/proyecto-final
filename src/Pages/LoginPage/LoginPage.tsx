import React, { useState } from "react";
import { Form, Input, Button, Typography, Card, Checkbox, message, Layout } from "antd";
import "./LoginStyle.css";
import { Link, useNavigate } from "react-router-dom";
import userApi from "../../api/userApi.ts"
import AppHeader from "../../Components/Header.tsx";
import AppFooter from "../../Components/Footer.tsx";
import { Content } from "antd/es/layout/layout";

const { Title } = Typography;

interface LoginResponse {
  success: boolean;
  message: string;
  result: any;
}

const realLogin = async (
  useremail: string,
  userpassword: string
): Promise<LoginResponse> => {
  try {
    const data: LoginResponse = await userApi.getLogin({ clientEmail: useremail, clientPassword: userpassword });
    console.log(data);
    console.log("2", useremail);
    console.log("3", userpassword);
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
  useremail: string;
  userpassword: string;
  remember: boolean;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    const response = await realLogin(values.useremail, values.userpassword);
    setLoading(false);

    if (response.success && response.result) {
      if (values.remember) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", response.result['userFirstName']);
        localStorage.setItem("userEmail", response.result['userEmail']);
        localStorage.setItem("userId", response.result['userId']);
        if (response.result['userRol'] == "Admin"){
          localStorage.setItem("userRol", "Admin")
        }
      } else {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("username", response.result['userFirstName']);
        sessionStorage.setItem("userEmail", response.result['userEmail']);
        sessionStorage.setItem("userId", response.result['userId']);
        if (response.result['userRol'] == "Admin"){
          sessionStorage.setItem("userRol", "Admin")
        }
      }
      message.success("¡Inicio de sesión exitoso!");
      navigate("/");
    } else {
      message.error(response.message || "No se pudo iniciar sesión");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Layout>
      <AppHeader />
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
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
              label="Email"
              name="useremail"
              rules={[
                { required: true, message: "Por favor, ingresa tu correo electronico!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Contraseña"
              name="userpassword"
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
            <Link to="/Registro">¿No tienes cuenta? Regístrate aquí</Link>
          </div>
        </Card>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default LoginPage;
