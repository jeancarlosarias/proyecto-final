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
import React, { useState, useEffect } from "react";
import { List, Pagination } from "antd";

interface Recipe {
  id: number;
  name: string;
}

// Datos estáticos de ejemplo
const allRecipes: Recipe[] = [
  { id: 1, name: "Sancocho Dominicano" },
  { id: 2, name: "Mangú con Los Tres Golpes" },
  { id: 3, name: "Arroz con Pollo" },
  { id: 4, name: "Tacos Mexicanos" },
  { id: 5, name: "Pasta Carbonara" },
  { id: 6, name: "Sopa de Lentejas" },
  { id: 7, name: "Empanadas Argentinas" },
  { id: 8, name: "Ceviche Peruano" },
];

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

const RecipePage: React.FC = () => {
  // Estados con tipos definidos
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Función para filtrar y paginar las recetas
  const fetchRecipes = (page: number, size: number, term: string) => {
    setLoading(true);
    const filteredRecipes = allRecipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(term.toLowerCase())
    );
    const start = (page - 1) * size;
    const end = start + size;
    setRecipes(filteredRecipes.slice(start, end));
    setTotal(filteredRecipes.length);
    setLoading(false);
  };

  // Efecto para actualizar las recetas cuando cambian la página, tamaño o término de búsqueda
  useEffect(() => {
    fetchRecipes(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm]);

  // Manejar la búsqueda
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reinicia a la primera página al buscar
  };

  // Manejar el cambio de página o tamaño de página
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

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
            defaultSelectedKeys={["2"]}
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
              <Menu.Item key="4">
                <Link to="/login">Login</Link>
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
            <Title>Busca tus Recetas favoritas</Title>
            <Paragraph>
              ¿Listo para cocinar con alma dominicana? ¡Sube el fuego y vamos!
            </Paragraph>
          </div>
        </div>
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
          <h2>Buscador de Recetas</h2>
          {/* Campo de búsqueda */}
          <Search
            placeholder="Buscar recetas por nombre"
            onSearch={handleSearch}
            enterButton="Buscar"
            size="large"
            style={{ marginBottom: "20px" }}
          />
          {/* Lista de recetas */}
          <List
            loading={loading}
            dataSource={recipes}
            renderItem={(recipe: Recipe) => (
              <List.Item>{recipe.name}</List.Item>
            )}
            bordered
          />
          {/* Paginación */}
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={["5", "10", "20"]}
            style={{ marginTop: "20px", textAlign: "center" }}
          />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Derechos de autor reservados @{new Date().getFullYear()} Creado por
        Desarrolladores Web
      </Footer>
    </Layout>
  );
};

export default RecipePage;
