import { apiRequest } from "./apiRequest";

// Global
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Prefix
const AUTH_PREFIX = `${API_URL}/v1/auth`;
const PROFILE_PREFIX = `${API_URL}/v1/user`;

// URLs
const REGISTER_URL = `${AUTH_PREFIX}/register`;
const LOGIN_URL = `${AUTH_PREFIX}/login`;
const PROFILE_URL = `${PROFILE_PREFIX}/me`;

export class UserService {
    static API_URL = API_URL;
    static LOGIN_URL = LOGIN_URL;
    static REGISTER_URL = REGISTER_URL;
    static PROFILE_URL = PROFILE_URL;

    static expiryTimeout = null;

    static parseJwt(tokenStr) {
        try {
            const parts = tokenStr.split('.');
            if (parts.length !== 3) return null;
            const payload = parts[1];
            const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const json = decodeURIComponent(atob(b64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(json);
        } catch (e) {
            return null;
        }
    }

    static scheduleAutoLogout(tokenStr, logout) {
        if (UserService.expiryTimeout) {
            clearTimeout(UserService.expiryTimeout);
            UserService.expiryTimeout = null;
        }
        const payload = UserService.parseJwt(tokenStr);
        if (!payload || !payload.exp) {
            return;
        }
        const expiryMs = payload.exp * 1000;
        const now = Date.now();
        const delay = expiryMs - now;
        if (delay <= 0) {
            logout && logout();
            return;
        }
        UserService.expiryTimeout = setTimeout(() => {
            logout && logout();
        }, delay + 1000);
    }

    static async authFetch(url, options = {}, token, logout) {
        const headers = options.headers || {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const opts = { ...options, headers };
        const response = await fetch(url, opts);
        if (response.status === 401) {
            logout && logout();
        }
        return response;
    }

    static async register(payload, logout) {
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
        const res = await apiRequest(REGISTER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.success) {
            const user = res.data?.user || res.data;
            const token = res.data?.token || null;

            if (token) UserService.scheduleAutoLogout(token, logout);

            return { success: true, user, token };
        } else {
            return {
                success: false,
                message: res.message || "Erreur lors de l'inscription",
            };
        }
    }

    static async login(payload, logout) {
        const res = await apiRequest(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (res.success) {
            const user = res.data?.user || res.data;
            const token = res.data?.token || null;
            if (token) UserService.scheduleAutoLogout(token, logout);
            return { success: true, user, token };
        } else {
            return {
                success: false,
                message: res.message || "Erreur lors de la connexion",
            };
        }
    }

    static async updateProfile(payload, token) {
        if (!token) {
            return { success: false, message: "Non authentifié" };
        }
        const res = await apiRequest(PROFILE_URL, {
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
    }

    static async deleteAccount(token) {
        if (!token) {
            return { success: false, message: "Non authentifié" };
        }
        const res = await apiRequest(PROFILE_URL, {
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
    }
}

export default UserService;
