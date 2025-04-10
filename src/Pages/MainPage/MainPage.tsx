import React, { useState, useEffect } from "react";
import { Layout, Carousel, Image, Typography, Row, Col, Modal, Button, Divider } from "antd";
import AppHeader from "../../Components/Header";
import AppFooter from "../../Components/Footer";
import recipeApi from "../../api/recipeApi.ts";
import RecipeCard from "../../Components/RecipeCard.tsx";
import favoriteApi from "../../api/favoriteApi.ts";
import ingredientApi from "../../api/ingredientApi.ts";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

interface Favorite {
  id: number;
  userId: number;
  recipeId: number;
}

interface Ingredient {
  id: number;
  recipeId: number;
  ingredientName: string;
  ingredientUnit: string;
}

interface RecipeI {
  Id: string;
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

const carouselImages = [
  "/src/assets/images/WhatsApp Image 2025-03-23 at 21.26.47_5c58729d.jpg",
  "/src/assets/images/WhatsApp Image 2025-03-23 at 21.26.47_a88c8c67.jpg",
  "/src/assets/images/WhatsApp Image 2025-03-23 at 21.26.47_ab1339bc.jpg",
  "/src/assets/images/WhatsApp Image 2025-03-23 at 21.26.47_c3d00ab9.jpg",
];

const MainPage = () => {
  const [recipes, setRecipes] = useState<RecipeI[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeI | null>(null);
  const [userData, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [ingredientsMap, setIngredientsMap] = useState<Record<number, Ingredient[]>>({});

  // Recetas predeterminadas
  const defaultRecipes: string[] = [
    "La Bandera Dominicana", "Morir Soñando", "Mamajuana", "Yaroa", 
    "Moro de Habichuelas", "Ponche de Huevo", "Ensalada de Papas Dominicana", "Pastel de Yuca"
  ];

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
        // Primero se buscan las recetas predeterminadas
        const recipeRequests = defaultRecipes.map((name) =>
          recipeApi.getRecipeByName({ name: name, limit: 1 })
        );

        const fetchedRecipes = await Promise.all(recipeRequests);
        const validRecipes = fetchedRecipes
          .filter((res: any) => res && res.success && res.result && typeof res.result === 'object')
          .map((res: any) => res.result);

        console.log("Recetas predeterminadas:", validRecipes);

        // Luego se agregan las recetas de la API
        const additionalRecipes = await recipeApi.getRecipes({ limit: 8 });
        const additionalValidRecipes = Array.isArray(additionalRecipes)
          ? additionalRecipes
          : additionalRecipes.result.filter((res: any) => 
              res && res.success && res.result && typeof res.result === 'object');

        console.log("Recetas adicionales de la API:", additionalValidRecipes);

        // Unir recetas predeterminadas con las adicionales
        setRecipes([...validRecipes, ...additionalValidRecipes]);

        // Verificar si alguna de las recetas predeterminadas está en favoritos
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
  }, [userData]);

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

  return (
    <Layout>
      <AppHeader />
      <Content style={{ padding: "0 48px", marginTop: 20 }}>
        <div style={{ padding: 24, minHeight: 380, background: "#ffff", borderRadius: 8 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title>Bienvenidos a Dominican Delights</Title>
            <Paragraph>¿Listo para cocinar con alma dominicana? ¡Sube el fuego y vamos!</Paragraph>
          </div>

          <Carousel autoplay effect="fade" dotPosition="bottom" style={{ marginBottom: 24, overflow: "hidden" }}>
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

          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Title level={2}>Recetas Destacadas</Title>
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
        </div>
      </Content>
      <AppFooter />

      {selectedRecipe && (
        <Modal
          open={!!selectedRecipe}
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
            <Title level={3} style={{ textAlign: "center", marginBottom: "16px", color: "#333", fontWeight: "600" }}>
              {selectedRecipe.recipeName}
            </Title>
            <Paragraph style={{ textAlign: "center", color: "#555", marginBottom: "24px", fontSize: "16px", lineHeight: "1.5" }}>
              {selectedRecipe.recipeDescription}
            </Paragraph>

            <Divider orientation="left" style={{ fontWeight: "bold", fontSize: "18px", color: "#1890ff" }}>INSTRUCCIONES</Divider>
            <Paragraph style={{ color: "#333", fontSize: "16px", lineHeight: "1.5" }}>
              {selectedRecipe.recipeInstruction}
            </Paragraph>

            <Divider orientation="left" style={{ fontWeight: "bold", fontSize: "18px", color: "#1890ff" }}>INGREDIENTES</Divider>
            {selectedRecipe.ingredients.map((ingredient, index) => (
              <Paragraph key={ingredient.id} style={{ color: "#333", fontSize: "16px", lineHeight: "1.5" }}>
                {index + 1}. {ingredient.ingredientName} ({ingredient.ingredientUnit})
              </Paragraph>
            ))}

            <Divider orientation="left" style={{ fontWeight: "bold", fontSize: "18px", color: "#1890ff" }}>TIEMPO DE PREPARACIÓN</Divider>
            <Paragraph style={{ color: "#333", fontSize: "16px", lineHeight: "1.5" }}>
              {selectedRecipe.recipePreparationTime}
            </Paragraph>

            <Divider orientation="left" style={{ fontWeight: "bold", fontSize: "18px", color: "#1890ff" }}>PORCIONES</Divider>
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

export default MainPage;
