import React from 'react';
import { Layout, Menu, Typography, Input, Card, Image, Button, Row, Col } from 'antd';
import '/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Styles/Global.css';
import { Link, useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;

// Datos de ejemplo para las recetas
const recipes = [
  {
    id: 1,
    title: 'Sancocho Dominicano',
    description: 'El tradicional guiso de siete carnes',
    image: 'https://example.com/sancocho.jpg',
    content: 'Receta completa aquí...'
  },
  {
    id: 2,
    title: 'Mangú',
    description: 'Plátanos verdes majados con los tres golpes',
    image: '/src/assets/images/how-to-make-mangu-DSC6702 (1).jpg',
    content: 'Receta completa aquí...'
  },
  {
    id: 2,
    title: 'Mangú',
    description: 'Plátanos verdes majados con los tres golpes',
    image: '/src/assets/images/how-to-make-mangu-DSC6702 (1).jpg',
    content: 'Receta completa aquí...'
  },
  {
    id: 2,
    title: 'Mangú',
    description: 'Plátanos verdes majados con los tres golpes',
    image: '/src/assets/images/how-to-make-mangu-DSC6702 (1).jpg',
    content: 'Receta completa aquí...'
  },
  {
    id: 2,
    title: 'Mangú',
    description: 'Plátanos verdes majados con los tres golpes',
    image: '/src/assets/images/how-to-make-mangu-DSC6702 (1).jpg',
    content: 'Receta completa aquí...'
  },
  {
    id: 2,
    title: 'Mangú',
    description: 'Plátanos verdes majados con los tres golpes',
    image: '/src/assets/images/how-to-make-mangu-DSC6702 (1).jpg',
    content: 'Receta completa aquí...'
  },
  {
    id: 2,
    title: 'Mangú',
    description: 'Plátanos verdes majados con los tres golpes',
    image: '/src/assets/images/how-to-make-mangu-DSC6702 (1).jpg',
    content: 'Receta completa aquí...'
  },
  {
    id: 2,
    title: 'Mangú',
    description: 'Plátanos verdes majados con los tres golpes',
    image: '/src/assets/images/how-to-make-mangu-DSC6702 (1).jpg',
    content: 'Receta completa aquí...'
  },
  {
    id: 2,
    title: 'Mangú',
    description: 'Plátanos verdes majados con los tres golpes',
    image: '/src/assets/images/how-to-make-mangu-DSC6702 (1).jpg',
    content: 'Receta completa aquí...'
  },
  {
    id: 2,
    title: 'Mangú',
    description: 'Plátanos verdes majados con los tres golpes',
    image: '/src/assets/images/how-to-make-mangu-DSC6702 (1).jpg',
    content: 'Receta completa aquí...'
  },
  {
    id: 2,
    title: 'Mangú',
    description: 'Plátanos verdes majados con los tres golpes',
    image: '/src/assets/images/how-to-make-mangu-DSC6702 (1).jpg',
    content: 'Receta completa aquí...'
  },
  {
    id: 2,
    title: 'Mangú',
    description: 'Plátanos verdes majados con los tres golpes',
    image: '/src/assets/images/how-to-make-mangu-DSC6702 (1).jpg',
    content: 'Receta completa aquí...'
  },
  // Agrega más recetas según necesites
];

const BlogPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (recipeId: number) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <Layout className="layout">
        <Header style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
            }}>
            {/* Logo */}
            <div className="logo" style={{ marginRight: '20px' }}>
            <Title level={3} style={{ color: 'white', margin: 0 }}>Bing</Title>
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
                <Menu.Item key="5">
                <Link to="/registro">Registro</Link>
                </Menu.Item>
            </Menu>
            </div>
        </div>
        </Header>

      <Content style={{ padding: '0 50px' }}>
        <div style={{ textAlign: 'center', marginTop: '50px', marginBottom: '30px' }}>
          <Title level={1}>Todas las Recetas</Title>
          <Paragraph>Descubre nuestra colección de recetas tradicionales</Paragraph>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
          {recipes.map((recipe) => (
            <Col xs={24} sm={12} md={8} lg={6} key={recipe.id}>
              <Card
                hoverable
                cover={
                  <Image
                    alt={recipe.title}
                    src={recipe.image}
                    height={200}
                    style={{ objectFit: 'cover' }}
                    preview={false}
                  />
                }
                onClick={() => handleCardClick(recipe.id)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Meta
                  title={recipe.title}
                  description={recipe.description}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        Dominican Delight © {new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default BlogPage;