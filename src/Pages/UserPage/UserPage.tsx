import React, { useEffect, useState } from "react";
import { Layout, Typography, Row, Col, Spin, Modal, Button, Divider, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import favoriteApi from "../../api/favoriteApi";
import recipeApi from "../../api/recipeApi";
import ingredientApi from "../../api/ingredientApi";
import RecipeCard from "../../Components/RecipeCard";
import AppHeader from "../../Components/Header";
import AppFooter from "../../Components/Footer";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

interface Favorite {
  favoriteId: number;
  userId: number;
  recipeId: number;
}

interface RecipeI {
  recipeId: number;
  recipeName: string;
  recipeDescription: string;
  recipeInstruction: string;
  recipePreparationTime: string;
  ingredients: Ingredient[],
  recipePortion: string;
  recipeUrl: string;
  categories: string;
}

interface Ingredient {
  ingredientId: number;
  recipeId: number;
  ingredientName: string;
  ingredientUnit: string;
}

const getInitial = (name: string) => name.charAt(0).toUpperCase();

const UserPage = () => {
  const [userData, setUserEmail] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [recipes, setRecipes] = useState<RecipeI[]>([]);
  const [ingredientsMap, setIngredientsMap] = useState<Record<number, Ingredient[]>>({});
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeI | null>(null); // Nueva variable de estado para los detalles

  // Simulación de sesión desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
    const storedId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
    const storedName = localStorage.getItem("username") || sessionStorage.getItem("username");
    if (storedUser && storedId && storedName) {
      setUserEmail(storedUser);
      setUserId(storedId);
      setUserName(storedName);
    }
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userData) return;

      const favResponse = await favoriteApi.getFavoriteByUser(userData);
      if (favResponse.success && Array.isArray(favResponse.result)) {
        setFavorites(favResponse.result);
      }
    };

    if (userData) fetchFavorites();
  }, [userData]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const recipeResponses = await Promise.all(
        favorites.map((fav) => recipeApi.getRecipeById(fav.recipeId))
      );

      const loadedRecipes: RecipeI[] = recipeResponses
        .filter((res: any) => res.success)
        .map((res: any) => res.result);

      setRecipes(loadedRecipes);
    };

    if (favorites.length > 0) fetchRecipes();
  }, [favorites]);

  useEffect(() => {
    const fetchIngredients = async () => {
      const ingredientMap: Record<number, Ingredient[]> = {};

      for (const recipe of recipes) {
        const res = await ingredientApi.getIngredients({ group: recipe.recipeId });
        if (res.success && Array.isArray(res.result)) {
          ingredientMap[recipe.recipeId] = res.result;
        } else {
          ingredientMap[recipe.recipeId] = [];
        }
      }

      setIngredientsMap(ingredientMap);
    };

    if (recipes.length > 0) fetchIngredients();
  }, [recipes]);

  const isFavorite = (recipeId: number) =>
    favorites.some((fav) => fav.recipeId === recipeId);

  const handleFavoriteToggle = async (recipeId: number) => {
    if (!userData) {
      return message.error("Debes iniciar sesión para manejar favoritos");
    }
  
    const isFav = isFavorite(recipeId);
  
    if (isFav) {
      // Encontrar el favorito correspondiente a esta receta
      const favoriteToDelete = favorites.find((fav) => fav.recipeId === recipeId);
      if (favoriteToDelete) {
        try {
          // Llamar a la API para eliminar el favorito
          const response = await favoriteApi.deleteFavorite(favoriteToDelete.favoriteId);
          
          if (response.success) {
            // Si la eliminación es exitosa, actualizar la lista de favoritos y recetas
            const updatedFavs = await favoriteApi.getFavoriteByUser(userData);
            if (updatedFavs.success) {
              setFavorites(updatedFavs.result);
  
              // Recargar las recetas de los favoritos actualizados
              const recipeResponses = await Promise.all(
                updatedFavs.result.map((fav: { recipeId: number; }) =>
                  recipeApi.getRecipeById(fav.recipeId)
                )
              );
              const loadedRecipes: RecipeI[] = recipeResponses
                .filter((res: any) => res.success)
                .map((res: any) => res.result);
              setRecipes(loadedRecipes);
            }
          } else {
            message.error('Error al eliminar el favorito');
          }
        } catch (error) {
          message.error('Error al intentar eliminar el favorito');
        }
      }
    } else {
      // Si no está en favoritos, agregarlo
      if (userId !== undefined) {
        try {
          const response = await favoriteApi.createFavorite({ userId: Number(userId), recipeId: recipeId });
          
          if (response.success) {
            // Actualizar favoritos después de agregar uno nuevo
            const updatedFavs = await favoriteApi.getFavoriteByUser(userData);
            if (updatedFavs.success) {
              setFavorites(updatedFavs.result);
  
              // Recargar las recetas de los favoritos actualizados
              const recipeResponses = await Promise.all(
                updatedFavs.result.map((fav: { recipeId: number; }) =>
                  recipeApi.getRecipeById(fav.recipeId)
                )
              );
              const loadedRecipes: RecipeI[] = recipeResponses
                .filter((res: any) => res.success)
                .map((res: any) => res.result);
              setRecipes(loadedRecipes);
            }
          }
        } catch (error) {
          message.error('Error al intentar agregar el favorito');
        }
      }
    }
  };
  
  

  const handleViewDetails = (recipe: RecipeI) => {
    setSelectedRecipe(recipe); // Almacenar la receta seleccionada
  };

  const handleCloseDetails = () => {
    setSelectedRecipe(null); // Cerrar detalles
  };

  return (
    <Layout>
      <AppHeader />
      <Content style={{ padding: "50px" }}>
        {userName ? (
          <div>
            {/* Perfil del usuario */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "40px",
                padding: "20px",
                backgroundColor: "#f0f2f5",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  backgroundColor: "#1890ff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "40px",
                  color: "white",
                  fontWeight: "bold",
                  marginRight: "20px",
                }}
              >
                {getInitial(userName)}
              </div>
              <div>
                <Title level={3} style={{ marginBottom: 0 }}>
                  {userName}
                </Title>
                <Paragraph type="secondary">{userData}</Paragraph>
              </div>
            </div>

            {/* Recetas favoritas */}
            <div style={{ marginTop: "30px" }}>
              <Title level={3} style={{ marginBottom: "24px" }}>
                Mis Recetas Favoritas
              </Title>
              {recipes.length > 0 ? (
                <Row gutter={[24, 24]}>
                  {recipes.map((recipe) => (
                    <Col key={recipe.recipeId} xs={24} sm={12} md={8} lg={6}>
                      <RecipeCard
                        recipe={recipe}
                        onSelect={() => handleViewDetails(recipe)} // Ver detalles
                        onFavoriteToggle={() => handleFavoriteToggle(recipe.recipeId)}
                        isFavorite={isFavorite(recipe.recipeId)}
                      />
                    </Col>
                  ))}
                </Row>
              ) : (
                <Paragraph style={{ textAlign: "center", fontSize: "16px" }}>
                  Aún no tienes recetas favoritas.
                </Paragraph>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", margin: "40px 0" }}>
            <Spin size="large" />
          </div>
        )}
      </Content>
      <AppFooter />

      {/* Modal de detalles de la receta */}
      {selectedRecipe && (
        <Modal
          visible={!!selectedRecipe}
          onCancel={handleCloseDetails}
          footer={null}
          width="90%"
          centered
          style={{
            borderRadius: "12px",
            padding: "20px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            maxWidth: "600px",
            minWidth: "300px",
          }}
          closeIcon={null}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Título de la receta */}
            <Title level={3} style={{ textAlign: "center", marginBottom: "16px", color: "#333", fontWeight: "600" }}>
              {selectedRecipe.recipeName}
            </Title>

            {/* Descripción de la receta */}
            <Paragraph style={{ textAlign: "center", color: "#555", marginBottom: "24px", fontSize: "16px", lineHeight: "1.5" }}>
              {selectedRecipe.recipeDescription}
            </Paragraph>

            {/* Instrucciones */}
            <Divider orientation="left" style={{ fontWeight: "bold", fontSize: "18px", color: "#1890ff" }}>
              INSTRUCCIONES
            </Divider>
            <Paragraph style={{ color: "#333", fontSize: "16px", lineHeight: "1.5" }}>
              {selectedRecipe.recipeInstruction}
            </Paragraph>

            {/* Ingredientes */}
            <Divider
              orientation="left"
              style={{ fontWeight: "bold", fontSize: "18px", color: "#1890ff" }}
            >
              INGREDIENTES
            </Divider>
            <Paragraph style={{ color: "#333", fontSize: "16px", lineHeight: "1.5" }}>
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <div key={ingredient.ingredientId}>
                  {index + 1}. {ingredient.ingredientName} ({ingredient.ingredientUnit})
                </div>
              ))}
            </Paragraph>

            {/* Tiempo de preparación */}
            <Divider orientation="left" style={{ fontWeight: "bold", fontSize: "18px", color: "#1890ff" }}>
              TIEMPO DE PREPARACION
            </Divider>
            <Paragraph style={{ color: "#333", fontSize: "16px", lineHeight: "1.5" }}>
              {selectedRecipe.recipePreparationTime}
            </Paragraph>

            {/* Porciones */}
            <Divider orientation="left" style={{ fontWeight: "bold", fontSize: "18px", color: "#1890ff" }}>
              PORCIONES
            </Divider>
            <Paragraph style={{ color: "#333", fontSize: "16px", lineHeight: "1.5" }}>
              {selectedRecipe.recipePortion}
            </Paragraph>

            {/* Botón de Cerrar */}
            <Button
              type="primary"
              onClick={handleCloseDetails}
              style={{
                width: "100%",
                padding: "12px 0",
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "8px",
              }}
            >
              Cerrar
            </Button>
          </div>
        </Modal>

      )}
    </Layout>
  );
};

export default UserPage;
