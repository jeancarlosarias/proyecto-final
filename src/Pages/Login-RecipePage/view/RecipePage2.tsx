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
import "/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Styles/global.css"; // Asegúrate que esta ruta sea correcta o usa rutas relativas/alias
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  // SettingOutlined, // No usado actualmente
  LogoutOutlined,
} from "@ant-design/icons";

// --- Interfaz ---
interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  ingredients: string[];
  instructions: string[];
}

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Meta } = Card;

const RecipePage2: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  // const [allRecipesData, setAllRecipesData] = useState<Recipe[]>([]); // Puede ser menos necesario ahora
  const [recipesToDisplay, setRecipesToDisplay] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(4); // Default page size
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

  // --- Efecto ÚNICO para obtener recetas (paginadas o por búsqueda) ---
  useEffect(() => {
    setLoading(true);
    const baseUrl = "https://localhost:7068"; // Asegúrate que sea HTTPS si el backend lo requiere
    let url = "";
    const isSearching = searchTerm.trim() !== "";

    if (isSearching) {
      // --- Búsqueda activa ---
      // Endpoint para buscar por nombre (idealmente devuelve TODOS los resultados)
      url = `${baseUrl}/api/Recipe/name/${encodeURIComponent(
        searchTerm.trim()
      )}`;
    } else {
      // --- Sin búsqueda (mostrar todo paginado por backend) ---
      // Endpoint para obtener recetas paginadas
      url = `${baseUrl}/api/Recipe?group=${currentPage}&limit=${pageSize}`;
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} on URL: ${url}`
          );
        }
        return response.json();
      })
      .then((data) => {
        // console.log("API Response:", data); // Ayuda a depurar la respuesta

        if (!data || !data.success) {
          // Maneja el caso donde 'data' o 'data.success' no existen o son falsos
          throw new Error(data?.message || "Invalid API response structure");
        }

        if (!Array.isArray(data.result)) {
          throw new Error("API response 'result' is not an array");
        }

        const mappedRecipes: Recipe[] = data.result.map((recipeDto: any) => ({
          // Usa 'any' temporalmente si la estructura exacta de DTO varía, o crea un DTO interface
          id: recipeDto.recipeId,
          title: recipeDto.recipeName,
          description: recipeDto.recipeDescription,
          image: recipeDto.recipeUrl || "/src/assets/images/placeholder.png", // Fallback por si la URL está vacía
          ingredients:
            recipeDto.ingredients?.map((ing: any) => ing.ingredientName) ?? [],
          instructions:
            recipeDto.recipeInstruction?.split(". ").filter((instr) => instr) ??
            [], // Filtra strings vacíos
        }));

        if (isSearching) {
          // --- Procesamiento para búsqueda ---
          // Se asume que la API de búsqueda devuelve *todos* los resultados
          // La paginación se aplica localmente a estos resultados
          setTotalRecipes(mappedRecipes.length); // Total es el número de resultados encontrados
          const start = (currentPage - 1) * pageSize;
          const end = start + pageSize;
          setRecipesToDisplay(mappedRecipes.slice(start, end)); // Mostrar la página actual de los resultados
          // setAllRecipesData(mappedRecipes); // Guardar todos si es necesario para otra cosa
        } else {
          // --- Procesamiento para vista paginada (sin búsqueda) ---
          // Se asume que la API devuelve solo las recetas de la página solicitada
          setRecipesToDisplay(mappedRecipes); // Mostrar directamente las recetas de esta página
          // **IMPORTANTE**: La API /api/Recipe DEBE devolver el total de recetas
          // para que la paginación funcione. Asumimos que está en 'data.totalCount'.
          // Si tu API lo devuelve en otro campo, ajústalo aquí.
          // Si no lo devuelve, la paginación será incorrecta.
          setTotalRecipes(data.totalCount || 20); // <--- AJUSTA ESTO según tu API
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recipes from backend:", error);
        setRecipesToDisplay([]); // Limpia las recetas en caso de error
        setTotalRecipes(0);
        setLoading(false);
        // Aquí podrías mostrar un mensaje de error al usuario
      });

    // Las dependencias ahora controlan cuándo se ejecuta el fetch
  }, [currentPage, pageSize, searchTerm]); // <- Dependencias correctas

  // --- ELIMINADO el segundo useEffect de filtrado local ---

  // --- Manejadores ---
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reinicia a la página 1 al buscar
  };

  const handlePageChange = (page: number, size?: number) => {
    // Si el tamaño de página cambia, también reinicia a la página 1
    // para evitar quedar en una página que no existe con el nuevo tamaño.
    const newPageSize = size || pageSize;
    if (size && size !== pageSize) {
      setCurrentPage(1);
      setPageSize(newPageSize);
    } else {
      setCurrentPage(page);
      setPageSize(newPageSize); // Asegura que pageSize esté actualizado
    }
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
    setSelectedRecipe(null); // Limpia la receta seleccionada al cerrar
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
          zIndex: 10, // Incrementado para asegurar que esté sobre el contenido
          width: "100%",
          padding: "0 24px", // Reducido el padding horizontal si es necesario
          backgroundColor: "#001529", // O el color que prefieras para el header
        }}
      >
        <div className="logo" style={{ marginRight: "20px" }}>
          <Title level={3} style={{ color: "white", margin: 0 }}>
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              {" "}
              {/* Enlace en el logo */}
              Dominican Delights
            </Link>
          </Title>
        </div>
        <div
          style={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "space-between", // Esto empuja los menús a los extremos
            alignItems: "center",
          }}
        >
          {/* Menú de Navegación Principal (a la izquierda después del logo) */}
          <Menu
            theme="dark"
            mode="horizontal"
            selectable={false} // Generalmente no seleccionas el menú principal así
            style={{ flex: 1, borderBottom: "none", lineHeight: "64px" }} // Ajusta lineHeight
            items={[
              { key: "1", label: <Link to="/">Inicio</Link> },
              { key: "2", label: <Link to="/recetaslg">Recetas</Link> },
              { key: "3", label: <Link to="/bloglg">Blog</Link> },
            ]}
          />

          {/* Menú de Usuario y Acciones (a la derecha) */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {/* Barra de Búsqueda dentro del Header (opcional) */}
            {/*
             <Search
                 placeholder="Buscar recetas..."
                 onSearch={handleSearch}
                 style={{ width: 200 }}
                 // Puedes quitar loading de aquí si lo tienes más abajo
             />
             */}
            <Menu
              theme="dark"
              mode="horizontal"
              selectable={false}
              style={{ borderBottom: "none", lineHeight: "64px" }} // Ajusta lineHeight
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
                      // label: "Salir", // Sin texto, solo icono si prefieres
                      onClick: handleLogout,
                      title: "Salir", // Tooltip para accesibilidad
                    }
                  : null,
              ].filter(
                (item): item is NonNullable<typeof item> => item !== null
              )} // Type guard para filtrar nulls
            />
          </div>
        </div>
      </Header>

      {/* --- Contenido de la Página de Recetas --- */}
      <Content
        style={{
          padding: "0 48px",
          marginTop: 20, // Reducido el margen superior si el header es sticky
          // background: colorBgContainer, // Color de fondo del contenido
          flexGrow: 1, // Asegura que el contenido llene el espacio
        }}
      >
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer, // Mueve el fondo aquí si prefieres
            borderRadius: borderRadiusLG,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Title level={2}>Explora Nuestras Recetas</Title>
            <Paragraph>
              Encuentra tu próxima comida favorita. Busca por nombre.
            </Paragraph>
            <Search
              placeholder="Buscar recetas por nombre..."
              onSearch={handleSearch} // Usa el handler que resetea la página
              onChange={(e) => {
                // Opcional: buscar mientras escribes (puede generar muchas llamadas API)
                // setSearchTerm(e.target.value);
                // setCurrentPage(1);
                // Opcional: Limpiar búsqueda si el campo se vacía manualmente
                if (e.target.value === "") {
                  handleSearch(""); // Llama a handleSearch con string vacío
                }
              }}
              onPressEnter={(e) => handleSearch(e.currentTarget.value)} // Buscar al presionar Enter
              enterButton="Buscar"
              size="large"
              loading={loading} // Muestra el spinner en el botón mientras carga
              style={{ maxWidth: 500, margin: "0 auto" }}
              // value={searchTerm} // Controla el input si buscas mientras escribes
            />
          </div>

          {/* --- Grid de Recetas --- */}
          <Spin spinning={loading} tip="Cargando recetas...">
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
                        // Usa una imagen placeholder local si es posible
                        fallback="/src/assets/images/placeholder.png"
                        preview={false} // Deshabilita preview en la tarjeta
                      />
                    }
                    onClick={() => showRecipeModal(recipe)}
                  >
                    <Meta
                      title={recipe.title}
                      description={
                        <Paragraph ellipsis={{ rows: 3 }}>
                          {recipe.description}
                        </Paragraph>
                      } // Limita descripción
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
                {searchTerm
                  ? "No se encontraron recetas que coincidan con tu búsqueda."
                  : "No hay recetas disponibles en este momento."}
              </Paragraph>
            </div>
          )}

          {/* --- Paginación --- */}
          {/* Muestra la paginación solo si hay más recetas que el tamaño de página */}
          {totalRecipes > pageSize && (
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalRecipes} // Usa el total correcto (de la API o de la búsqueda)
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["4", "8", "12", "16"]} // Opciones de tamaño
              style={{ marginTop: "30px", textAlign: "center" }}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} de ${total} recetas`
              } // Muestra el rango y total
            />
          )}
        </div>
      </Content>

      {/* --- Footer --- */}
      <Footer style={{ textAlign: "center", background: "#f0f2f5" }}>
        {" "}
        {/* Color opcional */}
        Dominican Delights ©{new Date().getFullYear()} Creado con Ant Design
      </Footer>

      {/* --- Modal para Detalles de Receta --- */}
      <Modal
        title={selectedRecipe?.title}
        open={isModalVisible} // 'open' es la prop correcta en Antd v5+
        onCancel={handleModalClose}
        footer={null} // Sin botones de footer por defecto
        width={800} // Ancho del modal
        destroyOnClose // Destruye el contenido del modal al cerrar para evitar estados viejos
      >
        {selectedRecipe && ( // Asegura que selectedRecipe exista antes de renderizar
          <Row gutter={[24, 16]}>
            {" "}
            {/* Espaciado entre columnas y filas */}
            <Col xs={24} md={10}>
              <Image
                alt={selectedRecipe.title}
                src={selectedRecipe.image}
                style={{
                  width: "100%",
                  maxHeight: 300, // Altura máxima para la imagen
                  objectFit: "cover",
                  borderRadius: "8px", // Bordes redondeados
                }}
                fallback="/src/assets/images/placeholder.png"
                // Preview habilitado por defecto en Modal Image, puedes deshabilitarlo si quieres
              />
            </Col>
            <Col xs={24} md={14}>
              <Title level={4} style={{ marginTop: 0 }}>
                Descripción
              </Title>
              <Paragraph>{selectedRecipe.description}</Paragraph>

              <Title level={4}>Ingredientes</Title>
              <List
                size="small"
                dataSource={selectedRecipe.ingredients}
                renderItem={(item) => <List.Item>• {item}</List.Item>} // Añade un bullet point
                style={{ marginBottom: "20px" }}
                bordered={false} // Quita el borde si prefieres
              />

              <Title level={4}>Instrucciones</Title>
              <List
                size="small"
                dataSource={selectedRecipe.instructions}
                renderItem={(item, index) =>
                  // Asegura que solo se muestren items con contenido
                  item.trim() && (
                    <List.Item>
                      <strong>{index + 1}.</strong> {item.trim()}
                    </List.Item>
                  )
                }
                split={false} // Quita las líneas divisorias si prefieres
              />
            </Col>
          </Row>
        )}
        {/* Puedes añadir un spinner dentro del modal si la carga del detalle fuera asíncrona */}
        {/* {!selectedRecipe && <Spin tip="Cargando detalles..."/>} */}
      </Modal>
    </Layout>
  );
};

export default RecipePage2;
