<script setup>
import { useUserStore } from "../store/useUser";
import { computed } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const isLogged = computed(() => !!userStore.isAuthenticated);
const router = useRouter();

const logout = () => {
    userStore.logout();
    router.push('/');
};
</script>

<template>
    <nav>
        <template v-if="isLogged">
            <span>Bonjour, {{ userStore.data.firstname }} !</span>
            <span>|</span>
            <router-link v-if="isLogged" to="/profile">Modifier mon profil</router-link>
            <a href="#" @click.prevent="logout">Déconnexion</a>
        </template>

        <template v-else>
            <router-link to="/login">Connexion</router-link>
            <router-link to="/register">Inscription</router-link>
        </template>
    </nav>
</template>
