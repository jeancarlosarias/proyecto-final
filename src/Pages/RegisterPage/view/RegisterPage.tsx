import React from "react";
import { Button, Checkbox, Form, Input, Select, Card, message } from "antd";
import "/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Styles/Global.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const url = "https://localhost:7068";
const Userspath = "/api/CreateLogin";

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

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const userData = {
        UserFirstName: values.Nombre,
        UserLastName: values.Apellido,
        UserEmail: values.email,
        UserPhone: `${values.prefix}${values.phone}`,
        UserRol: "User",
        UserSalt: "string",
        UserEncryptionKey: "string",
      };

      const response = await fetch(url + Userspath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          clientPassword: values.password,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("Registro exitoso:", data);
      message.success("Usuario registrado exitosamente!");
      form.resetFields();
      navigate("/login");
    } catch (error: any) {
      console.error("Error al registrar usuario:", error.message);
      message.error("Hubo un error al registrar el usuario.");
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
    <div className="center-container">
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
            name="Nombre"
            label="Nombre"
            tooltip="¿Cómo quieres que te llamen?"
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
            name="Apellido"
            label="Apellido"
            tooltip="¿Qué apellido eres?"
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
            name="email"
            label="Correo Electrónico"
            rules={[
              {
                type: "email",
                message: "El correo que ha puesto no es válido!",
              },
              {
                required: true,
                message: "Introduzca su correo electrónico!",
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
            name="phone"
            label="Número Telefónico"
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
            <Button type="primary" htmlType="submit">
              Registrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
