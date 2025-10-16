import { ref, watch } from "vue";
import { defineStore } from "pinia";
import UserService from "../services/userService";

export const useUserStore = defineStore("user", () => {
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
        console.log("Logging out user");
        data.value = null;
        token.value = null;
        isAuthenticated.value = false;
        console.log("User logged out", data.value, token.value, isAuthenticated.value);
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

    watch(token, (newToken) => {
        const decoded = UserService.parseJwt(newToken);
        if (!decoded || !decoded.exp || decoded.exp * 1000 <= Date.now()) {
            data.value = null;
            token.value = null;
            isAuthenticated.value = false;
            UserService.clearAutoLogout && UserService.clearAutoLogout();
            return;
        }

        UserService.scheduleAutoLogout(newToken, () => {
            data.value = null;
            token.value = null;
            isAuthenticated.value = false;
        });
    }, {
        immediate: true
    });

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
}, {
    persist: true
});

export default useUserStore;
