import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Input,
  Button,
  Form,
  message,
  Menu,
  InputNumber,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Footer, Header } from "antd/es/layout/layout";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

const CreateRecipe: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const url = "https://localhost:7068/api/Recipe";

  const CrearReceta = () => {};

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Formatea los datos para que coincidan con la API de recetas
      const recipeData = {
        categories: values.categories,
        recipeUrl: values.recipeUrl,
        recipeName: values.nombre,
        recipeDescription: values.descripcion,
        recipeInstruction: values.instrucciones,
        recipePreparationTime: values.tiempoPreparacion,
        recipePortion: values.porcion,
      };

      // Aquí iría la lógica para enviar los datos de la receta a tu API
      console.log("Datos de la receta:", recipeData);

      // Simulación de una llamada exitosa a la API de recetas
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success("¡Receta creada y guardada con éxito!");

      // **Importante:** Aquí deberías obtener el ID de la receta creada
      const recipeId = 123; // Simulación del ID de la receta

      // Ahora podrías procesar los ingredientes (values.ingredientes)
      // y hacer el POST a la API de ingredientes para cada uno.
      // Tendrías que dividir la cadena de ingredientes y posiblemente pedir la unidad.
      console.log("Ingredientes:", values.ingredientes);
      message.info(
        "Los ingredientes deben ser guardados usando el otro endpoint."
      );

      form.resetFields(); // Limpiar el formulario después de guardar
      navigate("/recetaslg"); // Redirigir a la página de recetas
    } catch (error) {
      console.error("Error al guardar la receta:", error);
      message.error("Hubo un error al guardar la receta. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

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
            defaultSelectedKeys={["4"]} // O podrías basarlo en la ruta actual
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
      <Content style={{ padding: "24px", minHeight: 280 }}>
        <Title level={2}>Crear Nueva Receta</Title>
        <Form
          form={form}
          name="createRecipeForm"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Nombre de la Receta"
            name="nombre"
            rules={[
              {
                required: true,
                message: "Por favor, introduce el nombre de la receta!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Nuevo campo para la URL de la imagen */}
          <Form.Item
            label="URL de la Imagen"
            name="recipeUrl"
            rules={[
              {
                required: true,
                message: "Por favor, introduce la URL de la imagen!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Nuevo campo para la categoría */}
          <Form.Item
            label="Categoría"
            name="categories"
            rules={[
              {
                required: true,
                message: "Por favor, introduce la categoría de la receta!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Nuevo campo para la descripción */}
          <Form.Item
            label="Descripción"
            name="descripcion"
            rules={[
              {
                required: true,
                message: "Por favor, introduce una descripción de la receta!",
              },
            ]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Ingredientes"
            name="ingredientes"
            rules={[
              {
                required: true,
                message: "Por favor, introduce los ingredientes!",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Lista de ingredientes separados por coma, por ejemplo: harina, azúcar, huevos"
            />
          </Form.Item>

          <Form.Item
            label="Instrucciones"
            name="instrucciones"
            rules={[
              {
                required: true,
                message: "Por favor, introduce las instrucciones!",
              },
            ]}
          >
            <TextArea rows={6} />
          </Form.Item>

          {/* Nuevo campo para el tiempo de preparación */}
          <Form.Item
            label="Tiempo de Preparación (ej: 30 minutos)"
            name="tiempoPreparacion"
            rules={[
              {
                required: true,
                message: "Por favor, introduce el tiempo de preparación!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Nuevo campo para las porciones */}
          <Form.Item
            label="Porciones"
            name="porcion"
            rules={[
              {
                required: true,
                message: "Por favor, introduce el número de porciones!",
              },
              {
                type: "integer",
                min: 1,
                message: "La porción debe ser un número mayor que 0!",
              },
            ]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Guardar Receta
            </Button>
          </Form.Item>
        </Form>
      </Content>
      <Footer
        style={{
          textAlign: "center",
          background: "#f0f2f5",
          marginTop: "80px",
        }}
      >
        {" "}
        {/* Color opcional */}
        Dominican Delights ©{new Date().getFullYear()} Creado con Ant Design
      </Footer>
    </Layout>
  );
};

export default CreateRecipe;
