<script setup>
import { ref, onMounted } from "vue";
import MockApi from "../services/mockApi";
import ProjectCard from "../components/ProjectCard.vue";

const projects = ref([]);
const q = ref("");

const load = async () => {
    projects.value = await MockApi.getProjects();
};
onMounted(load);

const search = async () => {
    projects.value = await MockApi.searchProjects(q.value);
};
const loadAll = load;

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
    <div class="container">
        <div class="search">
            <input v-model="q" placeholder="Recherche par mot-clé..." />
            <button @click="search">
                <i class="pi pi-search"></i>
            </button>
            <button @click="loadAll">
                <i class="pi pi-replay"></i>
            </button>
        </div>

        <div v-if="projects.length === 0">Aucun projet.</div>

        <div class="projects">
            <ProjectCard
                v-for="p in projects"
                :key="p.id"
                :project="p"
                @liked="onLiked"
                @disliked="onDisliked"
            />
        </div>
    </div>
</template>

<style>
.search {
    display: flex;
    align-items: center;
    gap: 16px;
}

.projects {
    display: flex;
    flex-direction: column;
    gap: 24px;
}
</style>
