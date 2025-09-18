import { ref } from "vue";
import { defineStore } from "pinia";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const useUserStore = defineStore("user", () => {
    const token = ref(null);
    const data = ref(null);
    const isAuthenticated = ref(false);

    async function register(payload) {
        try {
            const body = {
                email: payload.email,
                password: payload.password,
                firstname: payload.firstname,
                lastname: payload.lastname,
                school: payload.school || "",
                promo: payload.promo || "",
                telephone: payload.telephone || "",
                isContacted: payload.isContacted || false
            };
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const result = await response.json();
            if (response.ok && result) {
                data.value = result.user || result;
                token.value = result.token || null;
                isAuthenticated.value = true;
                return { success: true, user: data.value, token: token.value };
            } else {
                return { success: false, message: result.message || "Erreur d'inscription" };
            }
        } catch (e) {
            return { success: false, message: "Erreur réseau" };
        }
    }

    async function login(payload) {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (response.ok && result) {
                data.value = result.user || result;
                token.value = result.token || null;
                isAuthenticated.value = true;
                return { success: true, user: data.value, token: token.value };
            } else {
                return { success: false, message: result.message || "Erreur de connexion" };
            }
        } catch (e) {
            return { success: false, message: "Erreur réseau" };
        }
    }

    function logout() {
        data.value = null;
        token.value = null;
        isAuthenticated.value = false;
    }

    async function updateProfile(payload) {
        if (!token.value) {
            return { success: false, message: "Non authentifié" };
        }
        try {
            const response = await fetch(`${API_URL}/api/user/me`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token.value}`
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (response.ok && result) {
                data.value = { ...data.value, ...result };
                return { success: true, user: data.value };
            } else {
                return { success: false, message: result.message || "Erreur lors de la mise à jour" };
            }
        } catch (e) {
            return { success: false, message: "Erreur réseau" };
        }
    }

    async function deleteAccount() {
        // À implémenter
    }

    return {
        token,
        data,
        isAuthenticated,
        register,
        login,
        logout,
        updateProfile,
        deleteAccount
    };
},
{    persist: true,
})

export default useUserStore;
