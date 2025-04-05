import React, { useState, useEffect } from "react"; // Importa useState y useEffect
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
  Button, // Importa Button si quieres usarlo para el logout
} from "antd";
import "/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Styles/global.css";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

// La URL base y la ruta del API parecen no usarse directamente aquí para obtener el nombre,
// ya que lo guardaste en el storage. Los dejamos por si los necesitas para otra cosa.
// const url = "https://localhost:7068";
// const Userspath = "/api/Login";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;

// Tus arrays de items, imágenes y recetas permanecen igual...
const items = Array.from({ length: 15 }).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

const carouselImages = [
  "/src/assets/images/WhatsApp Image 2025-03-23 at 21.26.47_5c58729d.jpg",
  "/src/assets/images/WhatsApp Image 2025-03-23 at 21.26.47_a88c8c67.jpg",
  "/src/assets/images/WhatsApp Image 2025-03-23 at 21.26.47_ab1339bc.jpg",
  "/src/assets/images/WhatsApp Image 2025-03-23 at 21.26.47_c3d00ab9.jpg",
];

const recipes = [
  {
    id: 1,
    title: "Sancocho Dominicano",
    description: "El tradicional guiso de siete carnes",
    image:
      "/src/assets/images/Sancocho Dominicano Recipe - Poised Finance & Lifestyle.jpeg", // Asegúrate que esta URL sea válida o usa una local
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
    id: 3, // IDs deben ser únicos
    title: "Platanos Maduros",
    description: "Plátanos verdes majados con los tres golpes",
    image:
      "/src/assets/images/Fried Sweet Plantain Slices (Plátanos Maduros Fritos).jpeg",
    content: "Receta completa aquí...",
  },
  {
    id: 4,
    title: "Locrio",
    description:
      "Un arroz guisado similar a la paella, preparado con carne (pollo, cerdo, longaniza o mariscos) y sazonado con especias dominicanas.",
    image: "/src/assets/images/Dominican Moro-Locrio.jpeg",
    content: "Receta completa aquí...",
  },
];
// --- FIN de datos de ejemplo ---

const MainPage: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate(); // Hook para navegación

  // Estado para guardar el nombre de usuario logueado
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);

  // useEffect para leer el nombre de usuario del storage al cargar el componente
  useEffect(() => {
    const usernameFromLocalStorage = localStorage.getItem("username");
    const usernameFromSessionStorage = sessionStorage.getItem("username");

    // Usa el nombre de usuario que encuentres (prioriza localStorage si ambos existen)
    const username = usernameFromLocalStorage || usernameFromSessionStorage;

    if (username) {
      setLoggedInUsername(username);
    }
    // El array vacío [] como segundo argumento asegura que esto se ejecute solo una vez al montar
  }, []);

  // Función para manejar el logout
  const handleLogout = () => {
    // Limpia ambos storages por si acaso
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("username");

    // Limpia el estado local
    setLoggedInUsername(null);

    // Redirige a la página de login
    navigate("/login"); // Asegúrate que tu ruta de login sea '/login'
  };

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky", // Para que el header se quede fijo arriba
          top: 0, // Para que el header se quede fijo arriba
          zIndex: 1, // Para que el header se quede por encima del contenido
          width: "100%", // Para que ocupe todo el ancho
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
            defaultSelectedKeys={["1"]} // O podrías basarlo en la ruta actual
            style={{ flex: 1, borderBottom: "none" }}
            items={[
              // Forma alternativa y más moderna de definir items
              { key: "1", label: <Link to="/">Inicio</Link> },
              { key: "2", label: <Link to="/recetaslg">Recetas</Link> },
              { key: "3", label: <Link to="/bloglg">Blog</Link> },
              {
                key: "4",
                label: <Link to="/CreateRecipe">Crea tu receta</Link>,
              },
            ]}
          />

          {/* Iconos de Usuario / Configuración / Salir */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <Menu
              theme="dark"
              mode="horizontal"
              selectable={false} // Para que no se quede marcado un ícono
              style={{ borderBottom: "none" }}
              // Los items ahora pueden mostrar el nombre de usuario o manejar el logout
              items={[
                // Muestra el nombre de usuario si está logueado
                loggedInUsername
                  ? {
                      key: "user",
                      icon: <UserOutlined />,
                      label: (
                        <Link
                          to="/perfil"
                          style={{ color: "rgba(255, 255, 255, 0.85)" }}
                        >
                          {" "}
                          {/* Enlace a perfil */}
                          {loggedInUsername} {/* Muestra el nombre! */}
                        </Link>
                      ),
                    }
                  : {
                      // Si no está logueado, podría mostrar un enlace a Login
                      key: "login",
                      icon: <UserOutlined />,
                      label: <Link to="/login">Iniciar Sesión</Link>,
                    },
                // Mantenemos Configuración si es necesario
                loggedInUsername
                  ? {
                      key: "settings",
                      icon: <SettingOutlined />,
                      label: <Link to="/configuracion">Configuración</Link>, // Cambia la ruta si es necesario
                    }
                  : null,
                // Botón de Salir (solo si está logueado)
                loggedInUsername
                  ? {
                      key: "logout",
                      icon: <LogoutOutlined />,
                      label: <span onClick={handleLogout}>Salir</span>, // Llama a la función de logout al hacer clic
                    }
                  : null,
              ].filter((item) => item !== null)}
            />
          </div>
        </div>
      </Header>
      <Content style={{ padding: "0 48px", marginTop: 64 }}>
        {" "}
        {/* Añadido marginTop para compensar header fijo */}
        {/* Breadcrumb si lo necesitas */}
        {/* <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb> */}
        {/* Contenido Principal */}
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title>Bienvenidos a Dominican Delights</Title>
            <Paragraph>
              ¿Listo para cocinar con alma dominicana? ¡Sube el fuego y vamos!
            </Paragraph>
          </div>

          {/* Carrusel */}
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

          {/* Sección de Recetas */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Title level={2}>Recetas Destacadas</Title>
          </div>
          <Row gutter={[16, 16]}>
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
                      preview={true} // Puedes habilitar la vista previa si quieres
                    />
                  }
                  // Puedes añadir actions si quieres enlaces rápidos
                  // actions={[
                  //   <SettingOutlined key="setting" />,
                  //   <EditOutlined key="edit" />,
                  //   <EllipsisOutlined key="ellipsis" />,
                  // ]}
                >
                  <Card.Meta
                    title={recipe.title}
                    description={recipe.description}
                  />
                  {/* Podrías añadir un botón para ver la receta completa */}
                  {/* <Button type="primary" style={{ marginTop: '10px' }}>Ver Receta</Button> */}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Dominican Delights ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default MainPage;
