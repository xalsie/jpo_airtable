import { ref } from "vue";
import { defineStore } from "pinia";
import UserService from "../services/userService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const useUserStore = defineStore(
    "user",
    () => {
        const token = ref(null);
        const data = ref(null);
        const isAuthenticated = ref(false);

        async function register(payload) {
            const result = await UserService.register(payload);
            if (result.success) {
                data.value = result.user;
                token.value = result.token;
                isAuthenticated.value = true;
            }
            return result;
        }

        async function login(payload) {
            const result = await UserService.login(payload);
            if (result.success) {
                data.value = result.user;
                token.value = result.token;
                isAuthenticated.value = true;
            }
            return result;
        }

        function logout() {
            data.value = null;
            token.value = null;
            isAuthenticated.value = false;
        }

        async function updateProfile(payload) {
            const result = await UserService.updateProfile(
                payload,
                token.value
            );
            if (result.success) {
                data.value = { ...data.value, ...result.user };
            }
            return result;
        }

        async function deleteAccount() {
            const result = await UserService.deleteAccount(token.value);
            if (result.success) {
                logout();
            }
            return result;
        }

        return {
            token,
            data,
            isAuthenticated,
            register,
            login,
            logout,
            updateProfile,
            deleteAccount,
        };
    },
    { persist: true }
);

export default useUserStore;
