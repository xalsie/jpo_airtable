// Global
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Prefix
const AUTH_PREFIX = `${API_URL}/api/auth`;
const PROFILE_PREFIX = `${API_URL}/api/user`;

// URLs
const REGISTER_URL = `${AUTH_PREFIX}/register`;
const LOGIN_URL = `${AUTH_PREFIX}/login`;
const PROFILE_URL = `${PROFILE_PREFIX}/me`;

async function request(url, options = {}) {
    try {
        const response = await fetch(url, options);
        const result = await response.json().catch(() => null);

        if (response.ok) {
            return {
                success: true,
                status: response.status,
                data: result,
            };
        } else {
            return {
                success: false,
                status: response.status,
                message: result?.message || "Erreur serveur",
                data: result,
            };
        }
    } catch (e) {
        return { success: false, message: "Erreur réseau" };
    }
}

export const UserService = {
    API_URL,
    LOGIN_URL,
    REGISTER_URL,
    PROFILE_URL,

    async register(payload) {
        const body = {
            email: payload.email,
            password: payload.password,
            firstname: payload.firstname,
            lastname: payload.lastname,
            school: payload.school || "",
            promo: payload.promo || "",
            telephone: payload.telephone || "",
            isContacted: payload.isContacted || false,
        };
        const res = await request(REGISTER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.success) {
            const user = res.data?.user || res.data;
            const token = res.data?.token || null;
            return { success: true, user, token };
        } else {
            return {
                success: false,
                message: res.message || "Erreur lors de l'inscription",
            };
        }
    },

    async login(payload) {
        const res = await request(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (res.success) {
            const user = res.data?.user || res.data;
            const token = res.data?.token || null;
            return { success: true, user, token };
        } else {
            return {
                success: false,
                message: res.message || "Erreur lors de la connexion",
            };
        }
    },

    async updateProfile(payload, token) {
        if (!token) {
            return { success: false, message: "Non authentifié" };
        }
        const res = await request(PROFILE_URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        if (res.success) {
            const user = res.data || res.data?.user || res.data;
            return { success: true, user };
        } else {
            return {
                success: false,
                message: res.message || "Erreur lors de la mise à jour",
            };
        }
    },

    async deleteAccount(token) {
        if (!token) {
            return { success: false, message: "Non authentifié" };
        }
        const res = await request(PROFILE_URL, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.success) {
            return { success: true };
        } else {
            return {
                success: false,
                message: res.message || "Erreur lors de la suppression",
            };
        }
    },
};

export default UserService;
