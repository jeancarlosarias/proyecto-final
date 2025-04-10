import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Select, Card, message, Layout } from "antd";
import { Link, useNavigate } from "react-router-dom";
import userApi from "../../api/userApi.ts"
import AppHeader from "../../Components/Header.tsx";
import AppFooter from "../../Components/Footer.tsx";
import { Content } from "antd/es/layout/layout";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 18,
      offset: 6,
    },
  },
};

// interfaces
interface Response {
  success: boolean;
  message: string;
  result: any;
}

const register = async (
  userFirstName: string,
  userLastName: string,
  userEmail: string,
  userPhone: string,
  userRol: string,
  password: string
): Promise<Response> => {
  try {

    const userRequest = {
      userFirstName: userFirstName,
      userLastName: userLastName,
      userEmail: userEmail,
      userPhone: userPhone,
      userRol: userRol
    }

    const data: Response = await userApi.createLogin({ user: userRequest, clientPassword: password });
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

interface RegisterFormValues {
  userFirstName: string,
  userLastName: string,
  userEmail: string,
  userPhone: string,
  userRol: string,
  password: string
}

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [, setLoading] = useState(false);

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true);
    const response = await register(values.userFirstName, values.userLastName, values.userEmail, values.userPhone, values.userRol = 'User', values.password);
    setLoading(false);
    if (response.success && response.result) {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("username", response.result['userFirstName']);

      message.success("¡Registrado exitosamente!");
      navigate("/inicio");
    } else {
      message.error(response.message || "No se pudo registrar");
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="+1">+1</Option>
      </Select>
    </Form.Item>
  );

  const cardStyles = {
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "800px",
  };

  return (
    <Layout>
      <AppHeader />
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Card title="Formulario de Registro" style={cardStyles}>
          <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{ prefix: "+1" }}
            scrollToFirstError
          >
            <Form.Item
              name="userFirstName"
              label="Nombre"
              tooltip="¿Cómo te llamas?"
              rules={[
                {
                  required: true,
                  message: "Introduzca su nombre!",
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="userLastName"
              label="Apellido"
              tooltip="¿Cual es tu apellido?"
              rules={[
                {
                  required: true,
                  message: "Introduzca su apellido!",
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="userEmail"
              label="Correo Electrónico"
              rules={[
                {
                  type: "email",
                  message: "El correo que ha puesto no es valido!",
                },
                {
                  required: true,
                  message: "Introduzca su correo electronico!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Contraseña"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese su contraseña!",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirma la Contraseña"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Favor confirmar la contraseña!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("La contraseña que ha ingresado no coincide!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="userPhone"
              label="Numero Telefónico"
              rules={[
                {
                  required: true,
                  message: "Favor completar su número telefónico!",
                },
              ]}
            >
              <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error("Debe aceptar el acuerdo")),
                },
              ]}
              {...tailFormItemLayout}
            >
              <Checkbox>
                He leído el <a href="">acuerdo</a>
              </Checkbox>
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" block>
                Registrar
              </Button>
              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default RegisterPage;
