<template>
    <div class="container form-page">
        <h2>Connexion</h2>
        <form class="form" @submit.prevent="submit">
            <div class="form-elements">
                <input
                    v-model="email"
                    type="email"
                    placeholder="Email"
                    required
                />
                <input
                    v-model="password"
                    type="password"
                    placeholder="Mot de passe"
                    required
                    minlength="6"
                />
            </div>

            <div class="form-elements">
                <button type="submit" class="primary">Se connecter</button>
                <button type="submit" class="secondary">Retour</button>
            </div>
        </form>
        <div v-if="message" :style="{ color: messageColor }">{{ message }}</div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useUserStore } from "../store/useUser";
import { useRouter, useRoute } from "vue-router";

export default {
    setup() {
        const email = ref("");
        const password = ref("");
        const message = ref("");
        const messageColor = ref("red");
        const userStore = useUserStore();
        const router = useRouter();
        const route = useRoute();

        const submit = async () => {
            message.value = "";
            const res = await userStore.login({
                email: email.value,
                password: password.value,
            });
            if (res.success) {
                message.value = "Connexion réussie";
                messageColor.value = "green";
                router.push(route.query.redirect || "/");
            } else {
                message.value = res.message || "Erreur";
                messageColor.value = "red";
            }
        };

        return { email, password, submit, message, messageColor };
    },
};
</script>
