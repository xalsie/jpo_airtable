<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import MockApi from "../services/mockApi";
import ProjectCard from "../components/ProjectCard.vue";

const route = useRoute();
const project = ref(null);

const load = async () => {
    project.value = await MockApi.getProjectById(route.params.id);
};
onMounted(load);

const onLiked = async (id) => {
    await MockApi.likeProject(id);
    await load();
};

const onDisliked = async (id) => {
    await MockApi.dislikeProject(id);
    await load();
};
</script>

<template>
    <div v-if="project" class="container">
        <ProjectCard
            :key="project.id"
            :project="project"
            :showGoBack="true"
            @liked="onLiked"
            @disliked="onDisliked"
        />
    </div>

    <div v-else class="container center">
        <p>Chargement...</p>
    </div>
</template>
