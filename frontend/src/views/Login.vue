<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../store/useUser";
import { useRouter, useRoute } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const message = ref("");
const messageColor = ref("red");

const loading = ref(false);

const submit = async () => {
    if (loading.value) return;

    message.value = "";
    loading.value = true;
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

onMounted(() => {
    if (userStore.isLoggedIn) {
        router.push("/");
    }
});
</script>

<template>
    <div class="container center">
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
                <button type="submit" class="primary" :disabled="loading">
                    <span v-if="loading">Connexion...</span>
                    <span v-else>Se connecter</span>
                </button>
                <button type="button" class="secondary">
                    <router-link :to="'/'">Retour</router-link>
                </button>
            </div>
        </form>
        <div v-if="message" :style="{ color: messageColor }">{{ message }}</div>
    </div>
</template>
