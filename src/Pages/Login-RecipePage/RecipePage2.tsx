import React, { useState, useEffect } from "react";
import {
  Layout,
  Input,
  Row,
  Col,
  Modal,
  Button,
  Typography,
  Divider,
  Pagination,
  Spin,
  message,
} from "antd";
import AppHeader from "../../Components/Header";
import AppFooter from "../../Components/Footer";
import recipeApi from "../../api/recipeApi.ts";
import RecipeCard from "../../Components/RecipeCard.tsx";
import favoriteApi from "../../api/favoriteApi.ts";
import ingredientApi from "../../api/ingredientApi.ts";
import { SearchOutlined } from "@ant-design/icons";

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
  recipePortion: number;
  recipeUrl: string;
  categories: string;
}

const LIMIT = 8;

const RecipePage2 = () => {
  const [recipes, setRecipes] = useState<RecipeI[]>([]);
  const [tempSearch, setTempSearch] = useState<string>("");
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeI | null>(null);
  const [overlayRecipe, setOverlayRecipe] = useState<RecipeI | null>(null);
  const [userData, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [ingredientsMap, setIngredientsMap] = useState<Record<number, Ingredient[]>>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  // Cargar datos de usuario
  useEffect(() => {
    const storedUser =
      localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
    const storedId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");

    if (storedUser && storedId) {
      setUserEmail(storedUser);
      setUserId(storedId);
    }
  }, []);

  // Carga las recetas en modo "listado" si no se busca nada
  useEffect(() => {
    if (!tempSearch.trim()) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await recipeApi.getRecipes({
            limit: LIMIT,
            group: currentPage.toString(),
          });
          if (!Array.isArray(res) && res?.success && Array.isArray(res.result)) {
            setRecipes(res.result);
            setHasMore(res.result.length === LIMIT);
          }
          if (userData) {
            const favoriteResponse = await favoriteApi.getFavoriteByUser(userData);
            if (favoriteResponse.success && favoriteResponse.result) {
              setFavorites(favoriteResponse.result);
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          message.error("Error al cargar datos");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [currentPage, userData, tempSearch]);

  // Carga de ingredientes para cada receta
  useEffect(() => {
    const fetchIngredients = async () => {
      const ingredientMap: Record<number, Ingredient[]> = {};
      for (const recipe of recipes) {
        const res = await ingredientApi.getIngredients({ group: recipe.recipeId });
        ingredientMap[recipe.recipeId] =
          res.success && Array.isArray(res.result) ? res.result : [];
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
        await favoriteApi.createFavorite({ userId: Number(userId), recipeId });
      }
    }
    const updatedFavs = await favoriteApi.getFavoriteByUser(userData);
    if (updatedFavs.success) {
      setFavorites(updatedFavs.result);
    }
  };

  // Al llamar "Ver detalles" se cierra el overlay y se muestra el modal
  const handleViewDetails = (recipe: RecipeI) => {
    setOverlayRecipe(null);
    setSelectedRecipe(recipe);
  };

  const handleCloseDetails = () => {
    setSelectedRecipe(null);
  };

  // Buscar receta por nombre (usando getRecipeByName)
  const handleSearchClick = async () => {
    const searchText = tempSearch.trim();
    if (!searchText) {
      setOverlayRecipe(null);
      setCurrentPage(1);
      return;
    }
    setLoading(true);
    try {
      const res = await recipeApi.getRecipeByName({ name: searchText, limit: 1 });
      if (!Array.isArray(res) && res.success && res.result) {
        setOverlayRecipe(res.result);
      } else {
        setOverlayRecipe(null);
        message.info("No se encontró la receta.");
      }
    } catch (error) {
      console.error("Search error:", error);
      message.error("Error al buscar recetas");
    } finally {
      setLoading(false);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      <AppHeader />
      <Content style={{ padding: "0 48px", marginTop: 20, position: "relative" }}>
        <div style={{ padding: 24, minHeight: 380, background: "#fff", borderRadius: 8 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title>Buscar Recetas</Title>
            <div style={{ display: "flex", gap: "8px", marginBottom: 24 }}>
              <Input
                placeholder="Buscar por nombre de receta"
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                onPressEnter={handleSearchClick}
                allowClear
                style={{ flex: 1 }}
              />
              <Button
                type={tempSearch ? "primary" : "default"}
                onClick={handleSearchClick}
                icon={<SearchOutlined />}
                style={{ width: 120 }}
              >
                {tempSearch ? "Buscar" : "Mostrar todas"}
              </Button>
            </div>
          </div>

          <Spin spinning={loading} tip="Buscando recetas...">
            <Row gutter={[24, 24]}>
              {recipes.map((recipe) => (
                <Col key={recipe.recipeId} xs={24} sm={12} md={8} lg={6}>
                  <RecipeCard
                    recipe={{ ...recipe, recipePortion: Number(recipe.recipePortion).toString() }}
                    onSelect={() => handleViewDetails(recipe)}
                    onFavoriteToggle={() => handleFavoriteToggle(recipe.recipeId)}
                    isFavorite={isFavorite(recipe.recipeId)}
                  />
                </Col>
              ))}
            </Row>
          </Spin>

          {!tempSearch && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Pagination
                current={currentPage}
                pageSize={LIMIT}
                total={
                  hasMore || currentPage > 1
                    ? (currentPage + 1) * LIMIT
                    : currentPage * LIMIT
                }
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>

        {/* Overlay centrado en la pantalla */}
        {overlayRecipe && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              width: "100%",
              maxWidth: 320,
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 16,
            }}
          >
            <RecipeCard
              recipe={{
                ...overlayRecipe,
                recipePortion: Number(overlayRecipe.recipePortion).toString(),
              }}
              onSelect={() => handleViewDetails(overlayRecipe)}
              onFavoriteToggle={() => handleFavoriteToggle(overlayRecipe.recipeId)}
              isFavorite={isFavorite(overlayRecipe.recipeId)}
            />
          </div>
        )}
      </Content>

      <AppFooter />

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
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            maxWidth: "600px",
            minWidth: "300px",
          }}
          closeIcon={null}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Title level={3} style={{ textAlign: "center", marginBottom: "16px", color: "#333", fontWeight: "600" }}>
              {selectedRecipe.recipeName}
            </Title>
            <Paragraph style={{ textAlign: "center", color: "#555", marginBottom: "24px", fontSize: "16px", lineHeight: "1.5" }}>
              {selectedRecipe.recipeDescription}
            </Paragraph>
            <Divider orientation="left" style={{ fontWeight: "bold", fontSize: "18px", color: "#1890ff" }}>
              INSTRUCCIONES
            </Divider>
            <Paragraph style={{ color: "#333", fontSize: "16px", lineHeight: "1.5" }}>
              {selectedRecipe.recipeInstruction}
            </Paragraph>
            <Divider orientation="left" style={{ fontWeight: "bold", fontSize: "18px", color: "#1890ff" }}>
              INGREDIENTES
            </Divider>
            <Paragraph style={{ color: "#333", fontSize: "16px", lineHeight: "1.5" }}>
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <div key={ingredient.ingredientId}>
                  {index + 1}. {ingredient.ingredientName} ({ingredient.ingredientUnit})
                </div>
              ))}
            </Paragraph>
            <Divider orientation="left" style={{ fontWeight: "bold", fontSize: "18px", color: "#1890ff" }}>
              TIEMPO DE PREPARACION
            </Divider>
            <Paragraph style={{ color: "#333", fontSize: "16px", lineHeight: "1.5" }}>
              {selectedRecipe.recipePreparationTime}
            </Paragraph>
            <Divider orientation="left" style={{ fontWeight: "bold", fontSize: "18px", color: "#1890ff" }}>
              PORCIONES
            </Divider>
            <Paragraph style={{ color: "#333", fontSize: "16px", lineHeight: "1.5" }}>
              {selectedRecipe.recipePortion}
            </Paragraph>
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
