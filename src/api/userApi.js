const API_BASE_URL = "https://localhost:7068/api";

// Función para crear un user
const createLogin = async ({user, clientPassword}) => {
    try {
        const response = await fetch(`${API_BASE_URL}/CreateLogin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "clientPassword": clientPassword
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en crear un usuario:", error);
        return { success: false, message: error.message };
    }
};

// Funcion para obtener todos los usuario
const getUsers = async ({ limit, group } = {}) => {
    try {
        // Construir los parametros de consulta dinamicamente
        const queryParams = new URLSearchParams();
        if (limit) queryParams.append("limit", limit);
        if (group) queryParams.append("group", group);

        // Crear la URL final con los parametros
        const url = `${API_BASE_URL}/Users${queryParams.toString() ? `?${queryParams}` : ""}`;

        // Llamada a la API
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en obtener usuario:", error);
        return { success: false, message: error.message };
    }
};

// Funcion para Login
const getLogin = async ({clientEmail, clientPassword}) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Login`, {
            method: "GET",
            headers: {
                "clientEmail": clientEmail,
                "clientPassword": clientPassword
            }
        }
        );
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en obtener un usuario por ID:", error);
        return { success: false, message: error.message };
    }
};

// Funcion para obtener un favorite por ID
const getUserById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Users/${id}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en obtener un usuario por ID:", error);
        return { success: false, message: error.message };
    }
};

// Funcion para actualizar un user
const updateUser = async (id, user) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en actualizar un usuario:", error);
        return { success: false, message: error.message };
    }
};

// Funcion para eliminar un usuario
const deleteUser = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Users/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en eliminar un usuario:", error);
        return { success: false, message: error.message };
    }
};

export default {
    createLogin,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getLogin,
};
