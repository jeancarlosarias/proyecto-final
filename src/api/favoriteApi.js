const API_BASE_URL = "https://localhost:7068/api";

// Función para crear un favorite
const createFavorite = async (favorite) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Favorite`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(favorite),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en crear un favorito:", error);
        return { success: false, message: error.message };
    }
};

// Funcion para obtener todos los favorites
const getFavorites = async ({ limit, group } = {}) => {
    try {
        // Construir los parametros de consulta dinámicamente
        const queryParams = new URLSearchParams();
        if (limit) queryParams.append("limit", limit);
        if (group) queryParams.append("group", group);

        // Crear la URL final con los parametros
        const url = `${API_BASE_URL}/Favorite${queryParams.toString() ? `?${queryParams}` : ""}`;

        // Llamada a la API
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en obtener favorito:", error);
        return { success: false, message: error.message };
    }
};


// Función para obtener un favorite por ID
const getFavoriteById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Favorite/${id}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en obtener un favorito por ID:", error);
        return { success: false, message: error.message };
    }
};

// Función para actualizar un favorite
const updateFavorite = async (id, favorite) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Favorite/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(favorite),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en actualizar un favorito:", error);
        return { success: false, message: error.message };
    }
};

// Función para eliminar un favorite
const deleteFavorite = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Favorite/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Si la API devuelve un 204 (No Content), devolver un mensaje personalizado
        return response.status === 204 ? { success: true, message: "Deleted successfully" } : await response.json();
    } catch (error) {
        console.error("Error en eliminar un favorito:", error);
        return { success: false, message: error.message };
    }
};

export default {
    createFavorite,
    getFavorites,
    getFavoriteById,
    updateFavorite,
    deleteFavorite,
};
