import React from "react";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Carousel,
  Image,
  Typography,
  Input,
  Row,
  Col,
  Card,
} from "antd";
import "/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Styles/global.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { UserOutlined } from '@ant-design/icons';

const url = "https://localhost:7068";
const Userspath = "/api/CreateLogin";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;

const items = Array.from({ length: 15 }).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

const carouselImages = [
  "/src/assets/images copy/WhatsApp Image 2025-03-23 at 21.26.47_5c58729d.jpg",
  "/src/assets/images copy/WhatsApp Image 2025-03-23 at 21.26.47_a88c8c67.jpg",
  "/src/assets/images copy/WhatsApp Image 2025-03-23 at 21.26.47_ab1339bc.jpg",
  "/src/assets/images copy/WhatsApp Image 2025-03-23 at 21.26.47_c3d00ab9.jpg",
];

const recipes = [
  {
    id: 1,
    title: "Sancocho Dominicano",
    description: "El tradicional guiso de siete carnes",
    image: "https://example.com/sancocho.jpg",
    content: "Receta completa aquí...",
  },
  {
    id: 2,
    title: "Mangú",
    description: "Plátanos verdes majados con los tres golpes",
    image: "/src/assets/images/how-to-make-mangu-DSC6702 (1).jpg",
    content: "Receta completa aquí...",
  },
  {
    id: 2,
    title: "Mangú",
    description: "Plátanos verdes majados con los tres golpes",
    image: "/src/assets/images/how-to-make-mangu-DSC6702 (1).jpg",
    content: "Receta completa aquí...",
  },
  {
    id: 2,
    title: "Mangú",
    description: "Plátanos verdes majados con los tres golpes",
    image: "/src/assets/images/how-to-make-mangu-DSC6702 (1).jpg",
    content: "Receta completa aquí...",
  },
];

const MainPage: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div className="logo" style={{ marginRight: "20px" }}>
          <Title level={3} style={{ color: "white", margin: 0 }}>
            Dominican Delights
          </Title>
        </div>

        {/* Menú principal + Botones derecha */}
        <div
          style={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Menú Navegación */}
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            style={{ flex: 1, borderBottom: "none" }}
          >
            <Menu.Item key="1">
              <Link to="/">Inicio</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/recetas">Recetas</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/blog">Blog</Link>
            </Menu.Item>
          </Menu>

          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[]}
              style={{ borderBottom: "none" }}
            >
                <Menu.Item key="4" icon={<UserOutlined />}>
                     <Link to="/login">Usuario</Link>
                </Menu.Item>
            </Menu>
          </div>
        </div>
      </Header>
      <Content style={{ padding: "0 0px" }}>
        <div
          style={{
            width: "100%", // Ocupa el ancho completo del viewport
            position: "relative",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div style={{ marginLeft: "50px", textAlign: "center" }}>
            <Title>Bienvenidos a Dominican Delights </Title>
            <Paragraph>
              ¿Listo para cocinar con alma dominicana? ¡Sube el fuego y vamos!
            </Paragraph>
          </div>

          <Carousel
            autoplay
            effect="fade"
            dotPosition="bottom"
            style={{
              marginBottom: 24,
              borderRadius: borderRadiusLG,
              overflow: "hidden",
            }}
          >
            {carouselImages.map((img, index) => (
              <div key={index}>
                <Image
                  src={img}
                  alt={`Slide ${index + 1}`}
                  preview={false}
                  style={{
                    width: "1900px",
                    minHeight: "30vh",
                    height: "65vh",
                    objectFit: "cover",
                    objectPosition: "center center",
                  }}
                />
              </div>
            ))}
          </Carousel>
        </div>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
            textAlign: "center",
          }}
        >
          <Row gutter={[16, 16]} style={{ marginBottom: "30px" }}>
            {recipes.map((recipe) => (
              <Col xs={24} sm={12} md={8} lg={6} key={recipe.id}>
                <Card
                  hoverable
                  cover={
                    <Image
                      alt={recipe.title}
                      src={recipe.image}
                      height={200}
                      style={{ objectFit: "cover" }}
                      preview={false}
                    />
                  }
                >
                  <Card.Meta
                    title={recipe.title}
                    description={recipe.description}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default MainPage;
