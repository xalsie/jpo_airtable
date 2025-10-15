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
    <nav class="navbar">
        <div class="navbar-content">
            <template v-if="isLogged">
                <span>Bonjour, {{ userStore.data.firstname }} !</span>
                <span class="separator">|</span>
                <router-link v-if="isLogged" to="/profile">Modifier mon profil</router-link>
                <a href="#" @click.prevent="logout">Déconnexion</a>
            </template>
            <template v-else>
                <router-link to="/login">Connexion</router-link>
                <router-link to="/register">Inscription</router-link>
            </template>
        </div>
    </nav>
</template>

<style scoped>
.navbar {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1000;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    padding: 0 100px;
    height: 64px;
    display: flex;
    align-items: center;
}

.navbar-content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 36px;
}

.navbar a,
.navbar .router-link-active {
    text-transform: uppercase;
    font-size: 14px;
    text-decoration: none;
    color: inherit;
}

.separator {
    color: var(--dark-gray);
    margin: 0 8px;
}
</style>
