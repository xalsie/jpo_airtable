<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useUserStore } from "../store/useUser";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const user = ref(null);
const initial = reactive({
    firstname: "",
    lastname: "",
    email: "",
    school: "",
    promo: "",
    telephone: "",
    isContacted: false
});
const form = reactive({
    firstname: undefined,
    lastname: undefined,
    email: undefined,
    school: undefined,
    promo: undefined,
    telephone: undefined,
    isContacted: undefined
});
const message = ref("");
const messageColor = ref("green");

onMounted(() => {
    user.value = userStore.data;
    if (user.value) {
        initial.firstname = user.value.firstname || "";
        initial.lastname = user.value.lastname || "";
        initial.email = user.value.email || "";
        initial.school = user.value.school || "";
        initial.promo = user.value.promo || "";
        initial.telephone = user.value.telephone || "";
        initial.isContacted = user.value.isContacted || false;
    }
});

watch(
    () => userStore.user,
    (newUser) => {
        user.value = newUser;
        if (user.value) {
            initial.firstname = user.value.firstname || "";
            initial.lastname = user.value.lastname || "";
            initial.email = user.value.email || "";
            initial.school = user.value.school || "";
            initial.promo = user.value.promo || "";
            initial.telephone = user.value.telephone || "";
            initial.isContacted = user.value.isContacted || false;
        }
    }
);

const save = async () => {
    const payload = {};
    for (const key of Object.keys(form)) {
        if (form[key] !== undefined && form[key] !== initial[key]) {
            payload[key] = form[key];
        }
    }
    if (Object.keys(payload).length === 0) {
        message.value = "Aucune modification à enregistrer.";
        messageColor.value = "orange";
        return;
    }
    const res = await userStore.updateProfile(payload);
    if (res.success) {
        message.value = "Profil mis à jour";
        messageColor.value = "green";
    } else {
        message.value = res.message || "Erreur";
        messageColor.value = "red";
    }
};

const remove = async () => {
    const res = await userStore.deleteAccount();
    if (res.success) {
        router.push("/");
    } else {
        message.value = res.message || "Erreur";
        messageColor.value = "red";
    }
};
</script>

<template>
    <div class="container center">
        <div class="card">
            <h2 class="title">Mon Profil</h2>
            <div v-if="user">
                <form class="form" @submit.prevent="save">
                    <div class="form-elements">
                        <div class="form-row">
                            <input v-model="form.firstname" :placeholder="initial.firstname || 'Prénom'" />
                            <input v-model="form.lastname" :placeholder="initial.lastname || 'Nom'" />
                        </div>
                        <div class="form-row column">
                            <input v-model="form.email" type="email" :placeholder="initial.email || 'Email'" />
                        </div>
                        <div class="form-row">
                            <input v-model="form.school" :placeholder="initial.school || 'École'" />
                            <input v-model="form.promo" :placeholder="initial.promo || 'Promo'" />
                        </div>
                        <div class="form-row column">
                            <input v-model="form.telephone" :placeholder="initial.telephone || 'Téléphone'" />
                        </div>
                        <div class="form-row">
                            <label>
                                <input type="checkbox" v-model="form.isContacted" :checked="initial.isContacted" />
                                Je souhaite être contacté(e) pour plus d'informations
                            </label>
                        </div>
                    </div>
                    <div class="form-elements">
                        <button type="submit" class="primary">Enregistrer</button>
                        <button type="button" class="secondary" @click="remove">Supprimer mon compte</button>
                    </div>
                    <div v-if="message" :style="{ color: messageColor }" class="message">
                        {{ message }}
                    </div>
                </form>
            </div>
            <div v-else>Chargement...</div>
        </div>
    </div>
</template>

<style scoped>
.form-row {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
}
.form-row.column {
    flex-direction: column;
}
</style>
