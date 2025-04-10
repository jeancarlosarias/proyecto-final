import { Card, Button, Typography, Tag } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import React from "react";

interface Recipe {
  recipeId: number;
  recipeName: string;
  recipeUrl: string;
  recipeDescription: string;
  categories?: string;
  recipePortion?: string;
  recipePreparationTime?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (id: number) => void;
  onFavoriteToggle: (id: number) => void;
  isFavorite: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSelect,
  onFavoriteToggle,
  isFavorite
}) => {
  const handleFavoriteClick = () => {
    // Alterna entre agregar y quitar de favoritos
    onFavoriteToggle(Number(recipe.recipeId));
  };

  return (
    <Card
      hoverable
      cover={
        <img
          alt={recipe.recipeName}
          src={recipe.recipeUrl}
          onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}  // Imagen de respaldo si no existe
          style={{ height: "240px", objectFit: "cover" }}
        />
      }
      style={{ width: 300 }}
      actions={[
        <Button key="details" type="primary" onClick={() => onSelect(recipe.recipeId)}>
          Ver Detalles
        </Button>,
        <Button
          key="favorite"
          type="text"
          icon={isFavorite ? <StarFilled style={{ color: "#faad14" }} /> : <StarOutlined />}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        />
      ]}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {recipe.recipeName}
        </Typography.Title>
      </div>

      <Typography.Paragraph ellipsis={{ rows: 2 }} type="secondary">
        {recipe.recipeDescription}
      </Typography.Paragraph>

      <div style={{ margin: "8px 0" }}>
        {recipe.categories?.trim() &&
          recipe.categories.split(',').map((cat, index) => (
            <Tag key={index} color="green">{cat.trim()}</Tag>
          ))
        }
      </div>

      <Typography.Text strong>Porciones:</Typography.Text>{" "}
      {recipe.recipePortion ?? "N/A"}

      <br />

      <Typography.Text strong>Tiempo de preparación:</Typography.Text>{" "}
      {recipe.recipePreparationTime ?? "N/A"}
    </Card>
  );
};

export default RecipeCard;
