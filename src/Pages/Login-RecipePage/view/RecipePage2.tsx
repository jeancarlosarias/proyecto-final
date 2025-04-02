import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  theme,
  Image,
  Typography,
  Input,
  Row,
  Col,
  Card,
  Pagination,
  Modal,
  List,
  Spin,
} from "antd";
import "/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Styles/global.css";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

// --- Interfaz y Datos de Ejemplo Mejorados ---
interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  ingredients: string[];
  instructions: string[];
}

// --- Fin de Datos de Ejemplo ---

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Meta } = Card;

const RecipePage2: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  const [allRecipesData, setAllRecipesData] = useState<Recipe[]>([]);
  const [recipesToDisplay, setRecipesToDisplay] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(4);
  const [totalRecipes, setTotalRecipes] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // --- Efecto para cargar el usuario logueado ---
  useEffect(() => {
    const usernameFromLocalStorage = localStorage.getItem("username");
    const usernameFromSessionStorage = sessionStorage.getItem("username");
    const username = usernameFromLocalStorage || usernameFromSessionStorage;
    if (username) {
      setLoggedInUsername(username);
    }
  }, []);

  // --- Efecto para obtener recetas del backend ---
  useEffect(() => {
    setLoading(true);
    const baseUrl = "https://localhost:7068";
    const url = searchTerm
      ? `${baseUrl}/api/Recipe/name/${encodeURIComponent(searchTerm)}?limit=10`
      : `${baseUrl}/api/Recipe?group=${currentPage}&limit=${pageSize}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data.success) {
          throw new Error(data.message);
        }
        const mappedRecipes: Recipe[] = data.result.map((recipeDto) => ({
          id: recipeDto.recipeId,
          title: recipeDto.recipeName,
          description: recipeDto.recipeDescription,
          image: recipeDto.recipeUrl,
          ingredients: recipeDto.ingredients.map((ing) => ing.ingredientName),
          instructions: recipeDto.recipeInstruction.split(". "), // Ajusta el separador si es necesario
        }));
        setAllRecipesData(mappedRecipes);
        setTotalRecipes(mappedRecipes.length);
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        setRecipesToDisplay(mappedRecipes.slice(start, end));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recipes from backend:", error);
        setLoading(false);
      });
  }, [currentPage, pageSize, searchTerm]);

  // --- Efecto para filtrar recetas localmente (si aplica) ---
  useEffect(() => {
    const filtered = allRecipesData.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTotalRecipes(filtered.length);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setRecipesToDisplay(filtered.slice(start, end));
  }, [currentPage, pageSize, searchTerm, allRecipesData]);

  // --- Manejadores ---
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("username");
    setLoggedInUsername(null);
    navigate("/login");
  };

  const showRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRecipe(null);
  };

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* --- Header --- */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          padding: "0 24px",
        }}
      >
        <div className="logo" style={{ marginRight: "20px" }}>
          <Title level={3} style={{ color: "white", margin: 0 }}>
            Dominican Delights
          </Title>
        </div>
        <div
          style={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            style={{ flex: 1, borderBottom: "none" }}
            items={[
              { key: "1", label: <Link to="/">Inicio</Link> },
              { key: "2", label: <Link to="/recetas">Recetas</Link> },
              { key: "3", label: <Link to="/blog">Blog</Link> },
            ]}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <Menu
              theme="dark"
              mode="horizontal"
              selectable={false}
              style={{ borderBottom: "none" }}
              items={[
                loggedInUsername
                  ? {
                      key: "user",
                      icon: <UserOutlined />,
                      label: (
                        <Link
                          to="/perfil"
                          style={{ color: "rgba(255, 255, 255, 0.85)" }}
                        >
                          {loggedInUsername}
                        </Link>
                      ),
                    }
                  : {
                      key: "login",
                      icon: <UserOutlined />,
                      label: <Link to="/login">Iniciar Sesión</Link>,
                    },
                loggedInUsername
                  ? {
                      key: "logout",
                      icon: <LogoutOutlined />,
                      label: "Salir",
                      onClick: handleLogout,
                    }
                  : null,
              ].filter((item) => item !== null)}
            />
          </div>
        </div>
      </Header>

      {/* --- Contenido de la Página de Recetas --- */}
      <Content
        style={{
          padding: "0 48px",
          marginTop: 64,
          background: colorBgContainer,
          flexGrow: 1,
        }}
      >
        <div
          style={{ padding: 24, minHeight: 380, borderRadius: borderRadiusLG }}
        >
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Title level={2}>Explora Nuestras Recetas</Title>
            <Paragraph>
              Encuentra tu próxima comida favorita. Busca por nombre o
              ingrediente.
            </Paragraph>
            <Search
              placeholder="Buscar recetas..."
              onSearch={handleSearch}
              enterButton="Buscar"
              size="large"
              loading={loading}
              style={{ maxWidth: 500, margin: "0 auto" }}
            />
          </div>

          {/* --- Grid de Recetas --- */}
          <Spin spinning={loading}>
            <Row gutter={[16, 24]}>
              {recipesToDisplay.map((recipe) => (
                <Col xs={24} sm={12} md={8} lg={6} key={recipe.id}>
                  <Card
                    hoverable
                    cover={
                      <Image
                        alt={recipe.title}
                        src={recipe.image}
                        height={200}
                        style={{ objectFit: "cover" }}
                        fallback="/src/assets/images/placeholder.png"
                        preview={false}
                      />
                    }
                    onClick={() => showRecipeModal(recipe)}
                  >
                    <Meta
                      title={recipe.title}
                      description={recipe.description}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Spin>

          {/* Mensaje si no hay recetas */}
          {!loading && recipesToDisplay.length === 0 && (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
              <Paragraph>
                No se encontraron recetas que coincidan con tu búsqueda.
              </Paragraph>
            </div>
          )}

          {/* --- Paginación --- */}
          {totalRecipes > pageSize && (
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalRecipes}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["4", "8", "12", "16"]}
              style={{ marginTop: "30px", textAlign: "center" }}
            />
          )}
        </div>
      </Content>

      {/* --- Footer --- */}
      <Footer style={{ textAlign: "center" }}>
        Dominican Delights ©{new Date().getFullYear()} Creado con Ant Design
      </Footer>

      {/* --- Modal para Detalles de Receta --- */}
      <Modal
        title={selectedRecipe?.title}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        {selectedRecipe && (
          <Row gutter={24}>
            <Col xs={24} md={10}>
              <Image
                alt={selectedRecipe.title}
                src={selectedRecipe.image}
                style={{
                  width: "100%",
                  maxHeight: 300,
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                fallback="/src/assets/images/placeholder.png"
              />
            </Col>
            <Col xs={24} md={14}>
              <Title level={4}>Descripción</Title>
              <Paragraph>{selectedRecipe.description}</Paragraph>

              <Title level={4}>Ingredientes</Title>
              <List
                size="small"
                dataSource={selectedRecipe.ingredients}
                renderItem={(item) => <List.Item>{item}</List.Item>}
                style={{ marginBottom: "20px" }}
              />

              <Title level={4}>Instrucciones</Title>
              <List
                size="small"
                dataSource={selectedRecipe.instructions}
                renderItem={(item, index) => (
                  <List.Item>
                    {index + 1}. {item}
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        )}
      </Modal>
    </Layout>
  );
};

export default RecipePage2;
