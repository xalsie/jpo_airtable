<template>
    <div>
        <h2>Mon Profil</h2>
        <div v-if="user">
            <form @submit.prevent="save">
                <div><label>Nom</label><input v-model="form.name" /></div>
                <div>
                    <label>Email</label
                    ><input v-model="form.email" type="email" />
                </div>
                <button type="submit">Enregistrer</button>
            </form>
            <button @click="remove">Supprimer mon compte</button>
            <div v-if="message" :style="{ color: messageColor }">
                {{ message }}
            </div>
        </div>
        <div v-else>Chargement...</div>
    </div>
</template>

<script>
import { useUserStore } from "../store/useUser";
import { reactive, toRefs } from "vue";
import { useRouter } from "vue-router";

export default {
    setup() {
        const userStore = useUserStore();
        const router = useRouter();
        const user = userStore.user;
        const form = reactive({
            name: user?.name || "",
            email: user?.email || "",
        });
        const message = "";
        const messageColor = "green";

        const save = async () => {
            const res = await userStore.updateProfile({
                name: form.name,
                email: form.email,
            });
        };

        const remove = async () => {
            const res = await userStore.deleteAccount();
            if (res.success) router.push("/");
        };

        return { user, form, save, remove, message, messageColor };
    },
};
</script>
