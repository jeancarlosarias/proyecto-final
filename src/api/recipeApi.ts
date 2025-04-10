const API_BASE_URL = "https://localhost:7068/api";

// Interfaces
interface CreateRecipe {
  categories: string;
  recipeUrl: string;
  recipeName: string;
  recipeDescription: string;
  recipeInstruction: string;
  recipePreparationTime: string;
  recipePortion: number;
}

interface UpdateRecipe extends CreateRecipe {}

interface ApiResponse {
    success: boolean;
    message: string;
    result: any;
  }

// Función para crear una receta
const createRecipe = async (recipe: CreateRecipe): Promise<ApiResponse | { success: false; message: string; result: any }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Recipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(recipe),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error en crear una receta:", error);
    return { success: false, message: error.message, result: error.result };
  }
};

// Obtener todas las recetas
const getRecipes = async (params?: { limit?: number; group?: string }): Promise<ApiResponse[] | { success: false; message: string; result: any }> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.group) queryParams.append("group", params.group);

    const url = `${API_BASE_URL}/Recipe${queryParams.toString() ? `?${queryParams}` : ""}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error en obtener recetas:", error);
    return { success: false, message: error.message, result: error.result };
  }
};

// Obtener una receta por nombre
const getRecipeByName = async (params: { name: string; limit: number }): Promise<ApiResponse[] | { success: false; message: string; result: any }> => {
  try {
    const { name, limit } = params;
    const response = await fetch(`${API_BASE_URL}/Recipe/name/${name}?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error en obtener una receta por nombre:", error);
    return { success: false, message: error.message, result: error.result };
  }
};

// Obtener una receta por ID
const getRecipeById = async (id: number): Promise<ApiResponse | { success: false; message: string; result: any }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Recipe/${id}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error en obtener una receta por ID:", error);
    return { success: false, message: error.message, result: error.result };
  }
};

// Actualizar receta
const updateRecipe = async (id: number, recipe: UpdateRecipe): Promise<ApiResponse | { success: false; message: string; result: any }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Recipe/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error en actualizar una receta:", error);
    return { success: false, message: error.message, result: error.result };
  }
};

// Eliminar receta
const deleteRecipe = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Recipe/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error en eliminar una receta:", error);
    return { success: false, message: error.message, result: error.result };
  }
};

export default {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getRecipeByName,
};
