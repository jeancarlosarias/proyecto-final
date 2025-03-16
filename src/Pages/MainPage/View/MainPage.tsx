import React from 'react';
import { Breadcrumb, Layout, Menu, theme, Carousel, Image, Typography, Input} from 'antd';
import '/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Styles/global.css'
import { Link  } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;

const items = Array.from({ length: 15 }).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

const carouselImages = [
  '/src/assets/images/yone-lol-splash-art-uhdpaper.com-8K-7.2287.jpg',
  '/src/assets/images/cb298dc0-671b-4c02-9594-f6183c1d1b8f.png',
  '/src/assets/images/cb298dc0-671b-4c02-9594-f6183c1d1b8f.png',
  '/src/assets/images/how-to-make-mangu-DSC6702 (1).jpg'
];

const MainPage: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
            }}>
            {/* Logo */}
            <div className="logo" style={{ marginRight: '20px' }}>
            <Title level={3} style={{ color: 'white', margin: 0 }}>Dominican Delights</Title>
            </div>

            {/* Menú principal + Botones derecha */}
         <div style={{ 
            display: 'flex', 
            flexGrow: 1, 
            justifyContent: 'space-between', 
            alignItems: 'center' 
            }}>
            {/* Menú Navegación */}
            <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ flex: 1, borderBottom: 'none' }}
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

            {/* Contenedor derecha (Buscador + Auth) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Search
                placeholder="Búsqueda"
                onSearch={(value) => console.log(value)}
                style={{ width: 200 }}
            />
            
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[]}
                style={{ borderBottom: 'none' }}
            >
                <Menu.Item key="4">
                <Link to="/login">Login</Link>
                </Menu.Item>
            </Menu>
            </div>
        </div>
        </Header>
      <Content style={{ padding: '0 0px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ 

      width: '100vw', // Ocupa el ancho completo del viewport
      position: 'relative',
      left: '50%',
      transform: 'translateX(-50%)'
      }}>
      <Carousel 
        autoplay 
        effect="fade"
        dotPosition="bottom"
        style={{
          marginBottom: 24,
          borderRadius: borderRadiusLG,
          overflow: 'hidden'
        }}
      >
      {carouselImages.map((img, index) => (
        <div key={index}>
          <Image
            src={img}
            alt={`Slide ${index + 1}`}
            preview={false}
            style={{
              width: '100%',
              minHeight: '70vh',
              objectFit: 'cover',
              objectPosition: 'center center'
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
          }}
        >
          Content
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default MainPage;