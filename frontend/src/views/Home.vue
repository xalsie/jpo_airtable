<script setup>
import { ref, onMounted } from "vue";
import { useProjectStore } from "../store/useProject";
import ProjectCard from "../components/ProjectCard.vue";

const projectStore = useProjectStore();

const projects = ref([]);
const q = ref("");

const load = async () => {
    projects.value = await projectStore.getProjects();
};
onMounted(load);

const search = async () => {
    // TODO: Add endpoint in back-end.
    // projects.value = await projectStore.searchProjects(q.value);
    projects.value = await projectStore.getProjects();
};
const loadAll = load;

const onLiked = async (id) => {
    // TODO: Add endpoint in back-end.
    // await projectStore.likeProject(id);
    await load();
};

const onDisliked = async (id) => {
    // TODO: Add endpoint in back-end.
    // await projectStore.dislikeProject(id);
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

        <div v-if="projects.length === 0">Aucun projet enregistré.</div>

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
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    align-items: start;
    margin-top: 16px;
}

.projects > * {
    height: 100%;
    display: flex;
    flex-direction: column;
}

@media (max-width: 1024px) {
    .projects {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .projects {
        grid-template-columns: 1fr;
    }
}
</style>
