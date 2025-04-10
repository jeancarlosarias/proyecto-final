const API_BASE_URL = "https://localhost:7068/api";

interface CreateUser{
  userFirstName: string,
  userLastName: string,
  userEmail: string,
  userPhone: string,
  userRol: string
}

interface UpdateUser{
  userFirstName: string,
  userLastName: string,
  userEmail: string,
  userPhone: string
}

interface ApiResponse {
  success: boolean;
  message: string;
  result: any;
}

const createLogin = async ({
  user,
  clientPassword,
}: {
  user: CreateUser;
  clientPassword: string;
}): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/CreateLogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        clientPassword: clientPassword,
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error en crear un usuario:", error);
    return { success: false, message: error.message, result: error.result };
  }
};

const getUsers = async ({
  limit,
  group,
}: {
  limit?: number;
  group?: number;
} = {}): Promise<ApiResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append("limit", limit.toString());
    if (group) queryParams.append("group", group.toString());

    const url = `${API_BASE_URL}/Users${queryParams.toString() ? `?${queryParams}` : ""}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error en obtener usuarios:", error);
    return { success: false, message: error.message, result: error.result };
  }
};

const getLogin = async ({
  clientEmail,
  clientPassword,
}: {
  clientEmail: string;
  clientPassword: string;
}): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Login`, {
      method: "GET",
      headers: {
        clientEmail: clientEmail,
        clientPassword: clientPassword,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error en login:", error);
    return { success: false, message: error.message, result: error.result };
  }
};

const getUserById = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Users/${id}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error en obtener usuario por ID:", error);
    return { success: false, message: error.message, result: error.result };
  }
};

const updateUser = async ({clientPassword, user}:{clientPassword: string, user:UpdateUser}): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        clientPassword: clientPassword,
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error en actualizar un usuario:", error);
    return { success: false, message: error.message, result: error.result };
  }
};

const deleteUser = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error en eliminar un usuario:", error);
    return { success: false, message: error.message, result: error.result };
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
