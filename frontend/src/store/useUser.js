import { defineStore } from "pinia";
import MockApi from "../services/mockApi";

export const useUserStore = defineStore("user", {
    state: () => ({
        user: null,
    }),
    actions: {
        async register(payload) {
            const res = await MockApi.registerUser(payload);
            if (res.success) this.user = res.user;
            return res;
        },
        async login(payload) {
            const res = await MockApi.loginUser(payload);
            if (res.success) this.user = res.user;
            return res;
        },
        logout() {
            this.user = null;
        },
        async updateProfile(data) {
            if (!this.user) return { success: false, message: "Non connecté" };
            const res = await MockApi.updateUser(this.user.id, data);
            if (res.success) this.user = res.user;
            return res;
        },
        async deleteAccount() {
            if (!this.user) return { success: false, message: "Non connecté" };
            const res = await MockApi.deleteUser(this.user.id);
            if (res.success) this.user = null;
            return res;
        },
    },
});

export default useUserStore;
