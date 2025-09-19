<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../store/useUser";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const firstname = ref("");
const lastname = ref("");
const school = ref("");
const promo = ref("");
const telephone = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isContacted = ref(false);
const message = ref("");
const messageColor = ref("red");

const loading = ref(false);

const submit = async () => {
    if (loading.value) return;

    message.value = "";
    loading.value = true;
    const errors = [];

    if (!firstname.value || !lastname.value || !school.value || !promo.value) {
        errors.push("Tous les champs doivent être remplis.");
    }
    if (!/^\S+@\S+\.\S+$/.test(email.value)) {
        errors.push("L'adresse email n'est pas valide.");
    }
    if (password.value.length < 6) {
        errors.push("Le mot de passe doit contenir au moins 6 caractères.");
    }
    if (password.value !== confirmPassword.value) {
        errors.push("Les mots de passe ne correspondent pas.");
    }
    if (!/^(?:\+33|0)\d{9}$/.test(telephone.value)) {
        errors.push("Le numéro de téléphone n'est pas valide.");
    }
    if (telephone.value.replace(/\D/g, "").length < 8) {
        errors.push(
            "Le numéro de téléphone doit contenir au moins 8 chiffres."
        );
    }
    if (errors.length) {
        message.value = errors.join(" ");
        return;
    }
    if (telephone.value.startsWith("0")) {
        telephone.value = "+33" + telephone.value.slice(1);
    } else if (!telephone.value.startsWith("+33")) {
        telephone.value = "+33" + telephone.value;
    }

    const res = await userStore.register({
        email: email.value,
        password: password.value,
        firstname: firstname.value,
        lastname: lastname.value,
        school: school.value,
        promo: promo.value,
        telephone: telephone.value,
        isContacted: isContacted.value || false,
    });
    if (res.success) {
        message.value = "Inscription réussie";
        messageColor.value = "green";
        router.push("/");
    } else {
        message.value = res.message || "Erreur";
        messageColor.value = "red";
        loading.value = false;
    }
};

onMounted(() => {
    if (userStore.isLoggedIn) {
        router.push("/");
    }
});
</script>

<template>
    <div class="container space center">
        <h2 class="title">Créer un compte</h2>
        <form class="form" @submit.prevent="submit">
            <div class="form-elements">
                <div class="form-row">
                    <input v-model="lastname" placeholder="Nom" required />
                    <input v-model="firstname" placeholder="Prénom" required />
                </div>
                <div class="form-row">
                    <input
                        v-model="email"
                        type="email"
                        placeholder="Email"
                        required
                    />
                    <input
                        v-model="telephone"
                        placeholder="Téléphone"
                        required
                    />
                </div>
                <div class="form-column">
                    <input
                        v-model="password"
                        type="password"
                        placeholder="Mot de passe"
                        required
                        minlength="6"
                    />
                </div>
                <div class="form-column">
                    <input
                        v-model="confirmPassword"
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        required
                        minlength="6"
                    />
                </div>
                <div class="form-row">
                    <input v-model="school" placeholder="École" required />
                    <input v-model="promo" placeholder="Promo" required />
                </div>
                <div class="form-column">
                    <label>
                        <input type="checkbox" v-model="isContacted" />
                        Je souhaite être recontacté(e)
                    </label>
                </div>
            </div>

            <div class="form-buttons">
                <button type="submit" class="primary">
                    <span v-if="loading">Inscription...</span>
                    <span v-else>S'inscrire</span>
                </button>
                <button type="button" class="secondary">
                    <router-link :to="'/'">Retour</router-link>
                </button>
            </div>

            <div
                v-if="message"
                :style="{ color: messageColor }"
                class="message"
            >
                {{ message }}
            </div>
        </form>
    </div>
</template>
