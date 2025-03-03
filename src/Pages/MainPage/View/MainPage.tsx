import React from 'react';
import { Layout, Menu, Typography, Input, Card, Image, Carousel, Button } from 'antd';
import  '/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Styles/Global.css'


const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;

const MainPage: React.FC = () => {
  const carouselSettings = { // Opciones para el Carousel (puedes personalizarlas)
    autoplay: true,          // Carrusel automático
    dots: true,             // Mostrar puntos de navegación
    arrows: true,          // No mostrar flechas de navegación (puedes activar si quieres)
  };

  const carouselImages = [ // Array con URLs de imágenes para el carrusel
    "https://s1.1zoom.me/b4857/620/Fast_food_Hamburger_Vegetables_Fire_Two_520128_1920x1080.jpg", // Reemplaza con URLs reales
    "https://s1.1zoom.me/b4857/620/Fast_food_Hamburger_Vegetables_Fire_Two_520128_1920x1080.jpg",
    "https://s1.1zoom.me/b4857/620/Fast_food_Hamburger_Vegetables_Fire_Two_520128_1920x1080.jpg",
    "https://s1.1zoom.me/b4857/620/Fast_food_Hamburger_Vegetables_Fire_Two_520128_1920x1080.jpg",
  ];

  return (
    <Layout className="layout">
      <Header>
        {/* ... (Cabecera - igual que antes) */}
        <div className="logo" style={{ float: 'left', marginRight: '20px', color: 'white' }}>
          <Title level={3} style={{ color: 'white', marginBottom: 0 }}>Bing</Title>
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ float: 'left' }}>
          <Menu.Item key="1">Inicio</Menu.Item>
          <Menu.Item key="2">Recetas</Menu.Item>
          <Menu.Item key="3">Blog</Menu.Item>
          <Menu.Item key="4">Contactanos</Menu.Item>
        </Menu>
        <div style={{ float: 'right', alignContent:'center'}}>
          <Search placeholder="Búsqueda" onSearch={(value) => console.log(value)} style={{ width: 200, marginRight: '20px', alignContent: 'center'
           }} />
          <Button type="link" style={{ color: 'white' }}>Login</Button>
          <Button type='link' style={{ color: 'white' }}>Registratee</Button>
        </div>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div style={{ textAlign: 'center', marginTop: '50px', marginBottom: '30px' }}>
          <Title level={1}>Blog The Dominican Delight</Title>
          <Paragraph>Lo mejor de la cocina dominicana</Paragraph>
        </div>

        {/* Carrusel de imágenes */}
        <Carousel {...carouselSettings} style={{ marginBottom: '30px' }}>
          {carouselImages.map((imageURL, index) => (
            <div key={index}>
              <Image
                src={imageURL}
                alt={`Receta ${index + 1}`}
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} // Ajusta la altura máxima y el modo de ajuste
              />
            </div>
          ))}
        </Carousel>


        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* ... (Tarjetas de recetas - igual que antes) */}
          <Card
            cover={
              <Image
                alt="Dominican Delight 1"
                src="url"
              />
            }
          >
            <Title level={4}>DOMINICAN Delights</Title>
            <Paragraph>Card with stretched link</Paragraph>
            <Paragraph>Some quick example text to build on the card title and make up the bulk of the card's content.</Paragraph>
          </Card>
          {/* ... Repite el componente Card para más recetas */}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        {/* ... (Pie de página - igual que antes) */}
        Dominican Delight © {new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default MainPage;