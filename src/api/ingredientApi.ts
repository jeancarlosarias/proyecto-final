const API_BASE_URL = "https://localhost:7068/api";

interface createIngredient{
    recipeId: number,
    ingredientName: string,
    ingredientUnit: string
}

interface updateIngredient extends createIngredient {}

interface ApiResponse {
    success: boolean;
    message: string;
    result: any;
}

// Funcion para crear un ingrediente
const createIngredient = async (ingredient: createIngredient): Promise<ApiResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/Ingredient`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ingredient),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en crear un ingrediente:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return { success: false, message: errorMessage, result: null };
    }
};

// Funcion para obtener todos los ingredientes
const getIngredients = async ({ 
    limit, 
    group 
}: {
    limit?: number;
    group?: number;
} = {}): Promise<ApiResponse> => {
    try {
        // Construir los parametros de consulta dinamicamente
        const queryParams = new URLSearchParams();
        if (limit) queryParams.append("limit", limit.toString());
        if (group) queryParams.append("group", group.toString());

        // Crear la URL final con los parametros
        const url = `${API_BASE_URL}/Ingredient${queryParams.toString() ? `?${queryParams}` : ""}`;

        // Llamada a la API
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en obtener los ingredientes:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return { success: false, message: errorMessage, result: null };
    }
};

// Funcion para obtener un ingrediente por ID
const getIngredientById = async (id: number): Promise<ApiResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/Ingredient/${id}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en obtener un ingrediente:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return { success: false, message: errorMessage, result: null };
    }
};

// Funcion para actualizar un ingrediente
const updateIngredient = async (id: number, ingredient: updateIngredient): Promise<ApiResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/Ingredient/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ingredient),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en actualizar un ingrediente:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return { success: false, message: errorMessage, result: null };
    }
};

// Funcion para eliminar un ingrediente
const deleteIngredient = async (id: number): Promise<ApiResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/Ingredient/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en eliminar un ingrediente:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return { success: false, message: errorMessage, result: null };
    }
};

export default {
    createIngredient,
    getIngredients,
    getIngredientById,
    updateIngredient,
    deleteIngredient,
};
