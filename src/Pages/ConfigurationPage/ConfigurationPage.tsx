import React, { useEffect, useState } from "react";
import {
    Layout, Typography, Spin, message, Card, Form, Input, Select, Row, Col, Button
} from "antd";
import { SettingOutlined } from "@ant-design/icons"; // <-- Icono agregado
import AppHeader from "../../Components/Header";
import AppFooter from "../../Components/Footer";
import { useNavigate } from "react-router-dom";
import userApi from "../../api/userApi";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Option } = Select;

const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 6 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
};
const tailFormItemLayout = {
    wrapperCol: { xs: { span: 24 }, sm: { span: 18, offset: 6 } },
};

const updateUser = async (
    userFirstName: string,
    userLastName: string,
    userEmail: string,
    userPhone: string,
    password: string
) => {
    try {
        const userRequest = { userFirstName, userLastName, userEmail, userPhone };
        return await userApi.updateUser({ user: userRequest, clientPassword: password });
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Error al conectar con el servidor",
            result: false,
        };
    }
};

const deleteUser = async (userId: number) => {
    try {
        return await userApi.deleteUser(userId);
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Error al conectar con el servidor",
            result: false,
        };
    }
};

const getInitial = (name: string) => name.charAt(0).toUpperCase();

interface userUpdate {
    userFirstName: string,
    userLastName: string,
    userEmail: string,
    userPhone: string,
    password: string
}

const ConfigurationPage = () => {
    const [userData, setUserEmail] = useState<string>();
    const [userName, setUserName] = useState<string>();
    const [userId, setUserId] = useState<string>();
    const [, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values: userUpdate) => {
        setLoading(true);
        const user: userUpdate = {
            userFirstName: values.userFirstName,
            userLastName: values.userLastName,
            userEmail: userData || "",
            userPhone: values.userPhone,
            password: values.password
        }
        const response = await updateUser(user.userFirstName, user.userLastName, user.userEmail, user.userPhone, user.password);
        console.log(response);
        setLoading(false);
        if (response.success && response.result) {
            localStorage.setItem("username", user.userFirstName);
            sessionStorage.setItem("username", user.userFirstName);
            message.success("¡Actualizado exitosamente!");
            navigate("/");
        } else {
            message.error(response.message || "No se pudo actualizar el usuario");
        }
    };

    const onDelete = async () => {
        setLoading(true);
        const response = await deleteUser(Number(userId));
        setLoading(false);
        if (response.success && response.result) {
            localStorage.clear();
            sessionStorage.clear();
            message.success("¡Eliminado exitosamente!");
            navigate("/");
        } else {
            message.error(response.message || "No se pudo eliminar el usuario");
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
        const storedId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
        const storedName = localStorage.getItem("username") || sessionStorage.getItem("username");
        if (storedUser && storedId && storedName) {
            setUserEmail(storedUser);
            setUserId(storedId);
            setUserName(storedName);
        }
    }, []);

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
            <Content style={{ padding: "50px" }}>
                {userName ? (
                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "40px",
                                padding: "20px",
                                backgroundColor: "#f0f2f5",
                                borderRadius: "8px",
                            }}
                        >
                            <div
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    backgroundColor: "#1890ff",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "40px",
                                    color: "white",
                                    fontWeight: "bold",
                                    marginRight: "20px",
                                }}
                            >
                                {getInitial(userName)}
                            </div>
                            <div>
                                <Title level={3} style={{ marginBottom: 0 }}>
                                    {userName}
                                </Title>
                                <Paragraph type="secondary">{userData}</Paragraph>
                            </div>
                        </div>

                        <Card title={<><SettingOutlined /> Configuración de Cuenta</>} style={cardStyles}>
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
                                    rules={[{ required: true, message: "Introduzca su nombre!", whitespace: true }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="userLastName"
                                    label="Apellido"
                                    tooltip="¿Cual es tu apellido?"
                                    rules={[{ required: true, message: "Introduzca su apellido!", whitespace: true }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label="Nueva contraseña"
                                    rules={[{ required: true, message: "Por favor ingrese su contraseña!" }]}
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
                                        { required: true, message: "Favor confirmar la contraseña!" },
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
                                    label="Número Telefónico"
                                    rules={[{ required: true, message: "Favor completar su número telefónico!" }]}
                                >
                                    <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
                                </Form.Item>

                                <Form.Item {...tailFormItemLayout}>
                                    <Row gutter={[16, 8]} justify="start">
                                        <Col xs={24} sm={12}>
                                            <Button type="primary" htmlType="submit" block>
                                                Actualizar Usuario
                                            </Button>
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Button danger block onClick={onDelete}>
                                                Eliminar Usuario
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                ) : (
                    <div style={{ textAlign: "center", margin: "40px 0" }}>
                        <Spin size="large" />
                    </div>
                )}
            </Content>
            <AppFooter />
        </Layout>
    );
};

export default ConfigurationPage;
