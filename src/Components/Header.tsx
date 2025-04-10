import React from "react";
import { Layout, Menu, MenuProps, Drawer, Button } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, SettingOutlined, LogoutOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import logo from "../assets/images/logo.png";

const { Header } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
    const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false); // Estado para el tamaño de pantalla
    const navigate = useNavigate();

    useEffect(() => {
        const username = localStorage.getItem("username") || sessionStorage.getItem("username");
        const role = localStorage.getItem("userRol") || sessionStorage.getItem("userRol");

        if (username) {
            setLoggedInUsername(username);
        }

        if (role) {
            setUserRole(role);
        }

        // Detectar el tamaño de la pantalla
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // Cambiar el estado si el ancho es menor a 768px
        };

        // Escuchar el cambio de tamaño de pantalla
        window.addEventListener("resize", handleResize);

        // Comprobar el tamaño inicial
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        setLoggedInUsername(null);
        setUserRole(null);
        navigate("/");
    };

    const menuItems = [
        { key: "1", label: <Link to="/">INICIO</Link> },
        { key: "2", label: <Link to="/recetaslg">RECETAS</Link> },
        { key: "3", label: <Link to="/bloglg">BLOG</Link> },
        userRole === "Admin" && { key: "4", label: <Link to="/CreateRecipe">CREAR RECETA</Link> },
    ].filter(Boolean) as MenuProps["items"];

    const userMenuItems: MenuProps["items"] = [
        loggedInUsername
            ? {
                key: "user",
                icon: <UserOutlined />,
                label: (
                    <Link to="/User" style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                        {loggedInUsername}
                    </Link>
                ),
            }
            : {
                key: "login",
                icon: <UserOutlined />,
                label: <Link to="/Login">INICIAR SESIÓN</Link>,
            },
        loggedInUsername && {
            key: "settings",
            icon: <SettingOutlined />,
            label: <Link to="/Configuration">CONFIGURACIÓN</Link>,
        },
        loggedInUsername && {
            key: "logout",
            icon: <LogoutOutlined />,
            label: <span onClick={handleLogout}>SALIR</span>,
        },
    ].filter(Boolean) as MenuProps["items"];

    const toggleDrawer = () => setDrawerVisible(!drawerVisible);

    return (
        <Header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                zIndex: 1,
                width: "100%",
            }}
        >
            <div className="logo" style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "20px" }}>
                <img
                    src={logo}
                    alt="Logo"
                    style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                    }}
                />
                <Title level={3} style={{ color: "white", margin: 0 }}>
                    ᴅᴏᴍɪɴɪᴄᴀɴ ᴅᴇʟɪɢʜᴛꜱ
                </Title>
            </div>

            <div style={{ display: "flex", flexGrow: 1, justifyContent: "space-between", alignItems: "center" }}>
                {!isMobile ? (
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{ flex: 1, borderBottom: "none" }}
                        items={menuItems}
                    />
                ) : (
                    <Button
                        type="primary"
                        icon={<MenuOutlined />}
                        onClick={toggleDrawer}
                    />
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        selectable={false}
                        style={{ borderBottom: "none" }}
                        items={userMenuItems}
                    />
                </div>
            </div>

            <Drawer
                title={<Typography.Title level={3} style={{ color: 'white', margin: 0, textAlign: "center" }}/>} 
                placement="right"
                onClose={toggleDrawer}
                visible={drawerVisible}
                width="250px"
                style={{
                    backgroundColor: "#001529", // Fondo oscuro similar al del Header
                }}
                closeIcon={<CloseOutlined style={{ color: 'white' }} />}
            >
                <Menu theme="dark" mode="vertical" items={menuItems} />
                <Menu theme="dark" mode="vertical" items={userMenuItems} />
            </Drawer>
        </Header>
    );
};

export default AppHeader;
