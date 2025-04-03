const API_BASE_URL = "https://localhost:7068/api";

// Función para crear una receta
const createRecipe = async (recipe) => {
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
    } catch (error) {
        console.error("Error en crear una receta:", error);
        return { success: false, message: error.message };
    }
};

// Funcion para obtener todos las recetas
const getRecipes = async ({ limit, group } = {}) => {
    try {
        // Construir los parametros de consulta dinamicamente
        const queryParams = new URLSearchParams();
        if (limit) queryParams.append("limit", limit);
        if (group) queryParams.append("group", group);

        // Crear la URL final con los parametros
        const url = `${API_BASE_URL}/Recipe${queryParams.toString() ? `?${queryParams}` : ""}`;

        // Llamada a la API
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en obtener receta:", error);
        return { success: false, message: error.message };
    }
};

// Funcion para obtener un receta por nombre
const getRecipeByName = async ({name, limit}) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Recipe/name/${name}?limit=${limit}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en obtener una receta por nombre:", error);
        return { success: false, message: error.message };
    }
};

// Funcion para obtener un receta por ID
const getRecipeById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Recipe/${id}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en obtener una receta por ID:", error);
        return { success: false, message: error.message };
    }
};

// Funcion para actualizar una receta
const updateRecipe = async (id, recipe) => {
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
    } catch (error) {
        console.error("Error en actualizar una receta:", error);
        return { success: false, message: error.message };
    }
};

// Funcion para eliminar una receta
const deleteRecipe = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Recipe/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en eliminar una receta:", error);
        return { success: false, message: error.message };
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
