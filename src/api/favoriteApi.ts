const API_BASE_URL = "https://localhost:7068/api";

interface createFavorite{
    userId: number,
    recipeId: number
}

interface updateRecipe extends createFavorite {}

interface ApiResponse {
    success: boolean;
    message: string;
    result: any;
}

// Funcion para crear un favorite
const createFavorite = async (favorite: createFavorite): Promise<ApiResponse> => {
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
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return { success: false, message: errorMessage, result: null };
    }
};


const getFavorites = async ({ 
    limit, 
    group 
}:{
    limit?: number;
    group?: number;
} = {}): Promise<ApiResponse> => {
    try {
        // Construir los parametros de consulta dinamicamente
        const queryParams = new URLSearchParams();
        if (limit) queryParams.append("limit", limit.toString());
        if (group) queryParams.append("group", group.toString());

        // Crear la URL final con los parametros
        const url = `${API_BASE_URL}/Favorite${queryParams.toString() ? `?${queryParams}` : ""}`;

        // Llamada a la API
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en obtener los favoritos:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return { success: false, message: errorMessage, result: null };
    }
};


// Funcion para obtener un favorite por ID
const getFavoriteById = async (id: number): Promise<ApiResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/Favorite/${id}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en obtener un favorito por id:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return { success: false, message: errorMessage, result: null };
    }
};

// Funcion para obtener los favoritos del usuario por email
const getFavoriteByUser = async (userEmail: string): Promise<ApiResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/FavoriteByUser`, {
            method: "GET",
            headers: {
              userEmail: userEmail,
            },
          });
      
          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
      
          return await response.json();
    } catch (error) {
        console.error("Error en obtener un favorito por usuario:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return { success: false, message: errorMessage, result: null };
    }
};

// Funcion para actualizar un favorite
const updateFavorite = async (id: number, favorite: updateRecipe): Promise<ApiResponse> => {
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
        console.error("Error en actualizar un faavorito:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return { success: false, message: errorMessage, result: null };
    }
};

// Funcion para eliminar un favorite
const deleteFavorite = async (id: number): Promise<ApiResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/Favorite/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Si la API devuelve un 204 (No Content), devolver un mensaje personalizado
        return await response.json();
    } catch (error) {
        console.error("Error en eliminar un favorito:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return { success: false, message: errorMessage, result: null };
    }
};

export default {
    createFavorite,
    getFavorites,
    getFavoriteById,
    updateFavorite,
    deleteFavorite,
    getFavoriteByUser,
};
