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

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;

// Datos de ejemplo para las recetas
const recipes = [
  {
    id: 1,
    title: "Sancocho Dominicano",
    description:
      "Un guiso espeso y sabroso preparado con diferentes tipos de carne (res, cerdo, pollo), víveres como yuca, plátano y ñame, sazonado con especias y hierbas aromáticas.",
    image:
      "/src/assets/images/Sancocho Dominicano Recipe - Poised Finance & Lifestyle.jpeg",
    content: "Receta completa aquí...",
  },
  {
    id: 2,
    title: "Mangú",
    description:
      "Un puré de plátanos verdes hervidos, servido con cebolla roja salteada en vinagre, queso frito, salami y huevo frito. Es un desayuno típico dominicano",
    image: "/src/assets/images/how-to-make-mangu-DSC6702 (1).jpg",
    content: "Receta completa aquí...",
  },
  {
    id: 2,
    title: "Mofongo",
    description:
      "Hecho a base de plátanos verdes fritos y majados con ajo, chicharrón y aceite de oliva. Se sirve con caldo y puede incluir camarones, pollo o carne",
    image: "/src/assets/images/Food Stylist.jpeg",
    content: "Receta completa aquí...",
  },
  {
    id: 2,
    title: "La Bandera Dominicana –",
    description:
      "Es el plato más representativo de la República Dominicana, compuesto por arroz blanco, habichuelas guisadas y carne (pollo, res o cerdo), acompañado de ensalada y plátanos fritos.",
    image: "/src/assets/images/ARROZ-HABICHUELA-CARNE-@bar_dona_luz-edited.jpg",
    content: "Receta completa aquí...",
  },
  {
    id: 2,
    title: "Pastelón de Plátano Maduro",
    description:
      "Similar a una lasaña, este plato se elabora con capas de plátano maduro majado, carne molida sazonada y queso derretido, horneado hasta que quede dorado y cremoso.",
    image: "/src/assets/images/Pastelón de Plátano Maduro.jpeg",
    content: "Receta completa aquí...",
  },
  {
    id: 2,
    title: "Locrio",
    description:
      "Un arroz guisado similar a la paella, preparado con carne (pollo, cerdo, longaniza o mariscos) y sazonado con especias dominicanas.",
    image: "/src/assets/images/Dominican Moro-Locrio.jpeg",
    content: "Receta completa aquí...",
  },
  {
    id: 2,
    title: "Moro de Guandules con Coco",
    description:
      "Un arroz mezclado con guandules (gandules) y leche de coco, muy popular en la región este del país.",
    image:
      "/src/assets/images/Naihomy’s Dominican Moro de Guandules or Pigeon Peas & Rice, Flipped to Healthy – Familia Kitchen.jpeg",
    content: "Receta completa aquí...",
  },
  {
    id: 2,
    title: "Chenchén",
    description:
      "Plato típico del sur del país, hecho con maíz molido y cocido con leche de coco, servido con chivo guisado.",
    image:
      "/src/assets/images/Chenchén_ Recipe of the Flavorful Dominican Cracked Corn Pilaf.jpeg",
    content: "Receta completa aquí...",
  },
  // Agrega más recetas según necesites
];

//Agregar mas  postres

const recipesPostre = [
  {
    id: 1,
    title: "Arepa Dominicana",
    description:
      "En la gastronomía dominicana, la arepa es un pastel horneado a base de harina de maíz, leche de coco, azúcar y especias. Su textura es densa y ligeramente húmeda, con un sabor dulce y aromático. ",
    image:
      "/src/assets/images/Arepa Dominicana [Receta + Video] Arepa Dulce.jpeg",
    content: "Receta completa aquí...",
  },
  {
    id: 2,
    title: "Arroz con Leche",
    description:
      "Es un postre cremoso preparado con arroz, leche, azúcar y especias como canela y clavo dulce. Se cocina a fuego lento hasta que el arroz absorbe la leche y adquiere una textura suave",
    image: "/src/assets/images/Arroz con Leche Dominicano.jpeg",
    content: "Receta completa aquí...",
  },
  {
    id: 2,
    title: "Dulce de Platano",
    description:
      "Es un postre tradicional preparado con plátanos maduros en rodajas, cocidos con azúcar, canela, clavo dulce y a veces un toque de leche o vainilla.",
    image:
      "/src/assets/images/Fried Sweet Plantain Slices (Plátanos Maduros Fritos).jpeg",
    content: "Receta completa aquí...",
  },
  {
    id: 2,
    title: "Habichuelas con Dulce ",
    description:
      " Un postre tradicional dominicano hecho con habichuelas rojas, leche, azúcar, canela, batata y pasas, servido frío o caliente, especialmente en Semana Santa.",
    image:
      "/src/assets/images/Postres Dominicanos Tradicionales Más Populares.jpeg",
    content: "Receta completa aquí...",
  },
];

const MainPage2: React.FC = () => {
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

  const handleCardClick = (recipeId: number) => {
    navigate(`/recipe/${recipeId}`);
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
            defaultSelectedKeys={["3"]} // O podrías basarlo en la ruta actual
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
                          to="/User"
                          style={{ color: "rgba(255, 255, 255, 0.85)" }}
                        >
                          {""}
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

      <Content style={{ padding: "0 50px" }}>
        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
            marginBottom: "30px",
          }}
        >
          <Title level={1}>El Blog The Dominican Delights</Title>
          <Paragraph>
            Descubre nuestra colección de recetas tradicionales
          </Paragraph>
        </div>

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
                onClick={() => handleCardClick(recipe.id)}
                style={{ cursor: "pointer" }}
              >
                <Card.Meta
                  title={recipe.title}
                  description={recipe.description}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
            marginBottom: "30px",
          }}
        >
          <Title level={1}>Postres</Title>
          <Paragraph>Descubre nuestros mejores postres tradicionales</Paragraph>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: "30px" }}>
          {recipesPostre.map((recipesPostre) => (
            <Col xs={24} sm={12} md={8} lg={6} key={recipesPostre.id}>
              <Card
                hoverable
                cover={
                  <Image
                    alt={recipesPostre.title}
                    src={recipesPostre.image}
                    height={200}
                    style={{ objectFit: "cover" }}
                    preview={false}
                  />
                }
                onClick={() => handleCardClick(recipesPostre.id)}
                style={{ cursor: "pointer" }}
              >
                <Card.Meta
                  title={recipesPostre.title}
                  description={recipesPostre.description}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        Dominican Delight © {new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default MainPage2;
