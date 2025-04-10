import React, { useState, useEffect } from "react";
import { Layout, Input, Row, Col, Modal, Button, Typography, Divider, Pagination } from "antd";
import AppHeader from "../../Components/Header";
import AppFooter from "../../Components/Footer";
import recipeApi from "../../api/recipeApi.ts";
import RecipeCard from "../../Components/RecipeCard.tsx";
import favoriteApi from "../../api/favoriteApi.ts";
import ingredientApi from "../../api/ingredientApi.ts";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

interface Favorite {
  favoriteId: number;
  userId: number;
  recipeId: number;
}

interface Ingredient {
  ingredientId: number;
  recipeId: number;
  ingredientName: string;
  ingredientUnit: string;
}

interface RecipeI {
  recipeId: number;
  recipeName: string;
  recipeDescription: string;
  recipeInstruction: string;
  recipePreparationTime: string;
  ingredients: Ingredient[];
  recipePortion: string;
  recipeUrl: string;
  categories: string;
}

const LIMIT = 8;

const RecipePage2 = () => {
  const [recipes, setRecipes] = useState<RecipeI[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeI | null>(null);
  const [userData, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [ingredientsMap, setIngredientsMap] = useState<Record<number, Ingredient[]>>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true); // ✅ controlar si hay más recetas

  useEffect(() => {
    const storedUser = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
    const storedId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

    if (storedUser && storedId) {
      setUserEmail(storedUser);
      setUserId(storedId);
    }
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        let res;

        if (searchQuery) {
          res = await recipeApi.getRecipeByName({
            name: searchQuery,
            limit: LIMIT,
          });
        } else {
          res = await recipeApi.getRecipes({
            limit: LIMIT,
            group: currentPage.toString(),
          });
        }

        if (res && !Array.isArray(res) && res.success && Array.isArray(res.result)) {
          setRecipes(res.result);
          setHasMore(res.result.length === LIMIT); // ✅ si hay menos de LIMIT, ya no hay más páginas
        }

        if (userData) {
          const favoriteResponse = await favoriteApi.getFavoriteByUser(userData);
          if (favoriteResponse.success && favoriteResponse.result) {
            setFavorites(favoriteResponse.result);
          }
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, [userData, searchQuery, currentPage]);

  useEffect(() => {
    const fetchIngredients = async () => {
      const ingredientMap: Record<number, Ingredient[]> = {};
      for (const recipe of recipes) {
        const res = await ingredientApi.getIngredients({ group: recipe.recipeId });
        ingredientMap[recipe.recipeId] = res.success && Array.isArray(res.result) ? res.result : [];
      }
      setIngredientsMap(ingredientMap);
    };

    if (recipes.length > 0) fetchIngredients();
  }, [recipes]);

  const isFavorite = (recipeId: number) =>
    favorites.some((fav) => fav.recipeId === recipeId);

  const handleFavoriteToggle = async (recipeId: number) => {
    if (!userData) return;

    const isFav = isFavorite(recipeId);

    if (isFav) {
      await favoriteApi.deleteFavorite(recipeId);
    } else {
      if (userId) {
        await favoriteApi.createFavorite({ userId: Number(userId), recipeId: recipeId });
      }
    }

    const updatedFavs = await favoriteApi.getFavoriteByUser(userData);
    if (updatedFavs.success) {
      setFavorites(updatedFavs.result);
    }
  };

  const handleViewDetails = (recipe: RecipeI) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseDetails = () => {
    setSelectedRecipe(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reiniciar a página 1 cuando se cambia la búsqueda
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      <AppHeader />
      <Content style={{ padding: "0 48px", marginTop: 20 }}>
        <div style={{ padding: 24, minHeight: 380, background: "#fff", borderRadius: 8 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title>Buscar Recetas</Title>
            <Input
              placeholder="Buscar por nombre de receta"
              value={searchQuery}
              onChange={handleSearch}
              style={{ width: "100%", marginBottom: 24 }}
            />
          </div>

          <Row gutter={[24, 24]}>
            {recipes.map((recipe) => (
              <Col key={recipe.recipeId} xs={24} sm={12} md={8} lg={6}>
                <RecipeCard
                  recipe={recipe}
                  onSelect={() => handleViewDetails(recipe)}
                  onFavoriteToggle={() => handleFavoriteToggle(recipe.recipeId)}
                  isFavorite={isFavorite(recipe.recipeId)}
                />
              </Col>
            ))}
          </Row>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Pagination
              current={currentPage}
              pageSize={LIMIT}
              total={(hasMore || currentPage > 1) ? (currentPage + 1) * LIMIT : currentPage * LIMIT}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
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

export default RecipePage2;
