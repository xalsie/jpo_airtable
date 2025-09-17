<template>
    <div class="container center">
        <h2>Inscription</h2>
        <form class="form" @submit.prevent="submit">
            <div class="form-elements">
                <input v-model="name" placeholder="Nom" required />
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
                <button type="submit" class="primary">S'inscrire</button>
                <button type="button" class="secondary">
                    <router-link :to="'/'">Retour</router-link>
                </button>
            </div>
        </form>
        <div v-if="message" :style="{ color: messageColor }">{{ message }}</div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useUserStore } from "../store/useUser";
import { useRouter } from "vue-router";

export default {
    setup() {
        const name = ref("");
        const email = ref("");
        const password = ref("");
        const message = ref("");
        const messageColor = ref("red");
        const userStore = useUserStore();
        const router = useRouter();

        const submit = async () => {
            message.value = "";
            if (password.value.length < 6) {
                message.value =
                    "Le mot de passe doit contenir au moins 6 caractères.";
                return;
            }
            const res = await userStore.register({
                name: name.value,
                email: email.value,
                password: password.value,
            });
            if (res.success) {
                message.value = "Inscription réussie";
                messageColor.value = "green";
                router.push("/");
            } else {
                message.value = res.message || "Erreur";
                messageColor.value = "red";
            }
        };

        return { name, email, password, submit, message, messageColor };
    },
};
</script>
