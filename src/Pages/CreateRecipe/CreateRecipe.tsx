import React, { useState } from "react";
import {
  Layout,
  Typography,
  Input,
  Button,
  Form,
  message,
  InputNumber,
  Tag,
  Card,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons"; // Importamos el ícono PlusOutlined
import recipeApi from "../../api/recipeApi";

import "./CreateRecipe.css";
import AppHeader from "../../Components/Header.tsx";
import AppFooter from "../../Components/Footer";

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

interface Response {
  success: boolean;
  message: string;
  result: any;
}

const Recipe = async (
  categories: string,
  recipeUrl: string,
  recipeName: string,
  recipeDescription: string,
  recipeInstruction: string,
  recipePreparationTime: string,
  recipePortion: number
): Promise<Response> => {
  try {
    const data: Response = await recipeApi.createRecipe({
      categories,
      recipeUrl,
      recipeName,
      recipeDescription,
      recipeInstruction,
      recipePortion,
      recipePreparationTime,
    });
    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al conectar con el servidor",
      result: false,
    };
  }
};

interface FormRecipe {
  categories: string;
  recipeUrl: string;
  recipeName: string;
  recipeDescription: string;
  recipeInstruction: string;
  recipePreparationTime: string;
  recipePortion: number;
  ingredients: string[];
}

const CreateRecipe: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);

  const onFinish = async (values: FormRecipe) => {
    setLoading(true);
    try {
      const response = await Recipe(
        values.categories,
        values.recipeUrl,
        values.recipeName,
        values.recipeDescription,
        values.recipeInstruction,
        values.recipePreparationTime,
        values.recipePortion,
      );

      if (response.success) {
        form.resetFields();
        navigate("/recetaslg");
      }
    } catch (error) {
      console.error("Error al guardar la receta:", error);
      message.error("Hubo un error al guardar la receta. Intentalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  // Agregar un ingrediente dinámicamente
  const handleAddIngredient = () => {
    const ingredient = form.getFieldValue("ingredient");
    if (ingredient && !ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
      form.setFieldsValue({ ingredient: "" }); // Limpiar el campo de ingrediente
    } else {
      message.error("El ingrediente ya está en la lista o está vacio.");
    }
  };

  // Eliminar un ingrediente de la lista
  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((item) => item !== ingredient));
  };

  return (
    <Layout>
      <AppHeader />

      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Card style={{ width: 1000, padding: 20 }}>
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
              name="recipeName"
              rules={[{ required: true, message: "Por favor, introduce el nombre de la receta!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="URL de la Imagen"
              name="recipeUrl"
              rules={[{ required: true, message: "Por favor, introduce la URL de la imagen!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Categoría"
              name="categories"
              rules={[{ required: true, message: "Por favor, introduce la categoría de la receta!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Descripción"
              name="recipeDescription"
              rules={[{ required: true, message: "Por favor, introduce una descripción de la receta!" }]}
            >
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item
              label="Instrucciones"
              name="recipeInstruction"
              rules={[{ required: true, message: "Por favor, introduce las instrucciones!" }]}
            >
              <TextArea rows={6} />
            </Form.Item>

            <Form.Item
              label="Tiempo de Preparación (minutos)"
              name="recipePreparationTime"
              rules={[{ required: true, message: "Por favor, introduce el tiempo de preparacion!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Porciones"
              name="recipePortion"
              rules={[
                { required: true, message: "Por favor, introduce el número de porciones!" },
                { type: "integer", min: 1, message: "La porción debe ser un número mayor que 0!" },
              ]}
            >
              <InputNumber min={1} />
            </Form.Item>

            {/* Ingredientes dinamicos */}
            <Form.Item
              label="Ingrediente"
              name="ingredient"
              rules={[{ required: true, message: "Por favor, introduce un ingrediente!" }]}
            >
              <Input.Search
                enterButton={<PlusOutlined />} // Ícono de agregar ingrediente
                onSearch={handleAddIngredient}
              />
            </Form.Item>

            <div>
              {ingredients.map((ingredient, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => handleRemoveIngredient(ingredient)}
                  style={{ margin: 5 }}
                >
                  {ingredient}
                </Tag>
              ))}
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Guardar Receta
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>

      <AppFooter />
    </Layout>
  );
};

export default CreateRecipe;
