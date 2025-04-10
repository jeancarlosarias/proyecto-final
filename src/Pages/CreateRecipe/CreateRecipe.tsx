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
  Row,
  Col
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import recipeApi from "../../api/recipeApi";
import ingredientApi from "../../api/ingredientApi.ts";

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

interface Ingredient {
  recipeId: number;
  ingredientName: string;
  ingredientUnit: string;
}

interface FormRecipe {
  categories: string;
  recipeUrl: string;
  recipeName: string;
  recipeDescription: string;
  recipeInstruction: string;
  recipePreparationTime: string;
  recipePortion: number;
}

interface IngredientForm {
  name: string;
  unit: string;
}

const CreateRecipe: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientForm[]>([]);

  const onFinish = async (values: FormRecipe) => {
    setLoading(true);
    try {
      // Crear la receta primero
      const recipeResponse = await recipeApi.createRecipe({
        categories: values.categories,
        recipeUrl: values.recipeUrl,
        recipeName: values.recipeName,
        recipeDescription: values.recipeDescription,
        recipeInstruction: values.recipeInstruction,
        recipePortion: values.recipePortion,
        recipePreparationTime: values.recipePreparationTime,
      });
      console.log("1", recipeResponse);
      if (recipeResponse.success) {
        const recipeId = recipeResponse.result.recipeId;
        const response = await Promise.all(
          ingredients.map(ingredient =>
            ingredientApi.createIngredient({
              recipeId,
              ingredientName: ingredient.name,
              ingredientUnit: ingredient.unit
            })
          )
        );
        console.log("2", response);
        form.resetFields();
        setIngredients([]);
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

  const handleAddIngredient = () => {
    const name = form.getFieldValue("ingredientName");
    const unit = form.getFieldValue("ingredientUnit");

    if (name && unit) {
      setIngredients([...ingredients, { name, unit }]);
      form.setFieldsValue({ ingredientName: "", ingredientUnit: "" });
    } else {
      message.error("Debes completar ambos campos del ingrediente");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
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
            {/* Campos de la receta (sin cambios) */}
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
              label="Tiempo de Preparación (HH:MM:SS)"
              name="recipePreparationTime"
              rules={[
                {
                  required: true,
                  message: "Por favor, introduce el tiempo de preparación!"
                },
                {
                  pattern: /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
                  message: "Formato inválido. Usa HH:MM:SS (ej: 02:30:00)"
                }
              ]}
            >
              <Input
                placeholder="00:00:00"
                addonAfter="HH:MM:SS"
                style={{ width: 200 }}
              />
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

            {/* Seccion de ingredientes */}
            <Form.Item label="Ingredientes">
              <Row gutter={8}>
                <Col span={10}>
                  <Form.Item
                    name="ingredientName"
                    rules={[{ required: false, message: "Nombre requerido" }]}
                  >
                    <Input placeholder="Nombre del ingrediente" />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    name="ingredientUnit"
                    rules={[{ required: false, message: "Unidad requerida" }]}
                  >
                    <Input placeholder="Unidad (ej: tazas, gramos)" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={handleAddIngredient}
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>
            </Form.Item>

            <div>
              {ingredients.map((ingredient, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => handleRemoveIngredient(index)}
                  style={{ margin: 5 }}
                >
                  {ingredient.name} - {ingredient.unit}
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