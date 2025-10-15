<script setup>
import { ref, onMounted } from "vue";
import { useProjectStore } from "../store/useProject";
import ProjectCard from "../components/ProjectCard.vue";

const projectStore = useProjectStore();

const projects = ref([]);
const showEmptyMessage = ref(false);

const load = async (page = 1) => {
    showEmptyMessage.value = false;
    const res = await projectStore.getProjects(page, projectStore.meta?.limit || 9);
    if (res.success) projects.value = projectStore.projects;

    if (projects.value.length === 0) {
        setTimeout(() => {
            if (projects.value.length === 0) showEmptyMessage.value = true;
        }, 2000);
    }
};

onMounted(() => load());

const onLiked = async (id, userLiked) => {
    await projectStore.likeProject(id, userLiked);
};

const onDisliked = async (id, userDisliked) => {
    await projectStore.dislikeProject(id, userDisliked);
};
</script>

<template>
    <div class="container">
        <!-- <div class="search">
            <input v-model="searchValue" placeholder="Recherche par mot-clé..." />
            <button @click="search">
                <i class="pi pi-search"></i>
            </button>
            <button @click="resetSearch">
                <i class="pi pi-replay"></i>
            </button>
        </div> -->

        <div v-if="projects.length === 0 && showEmptyMessage">
            <span>Aucun projet enregistré.</span>
        </div>

        <div v-else class="projects">
            <ProjectCard
                v-for="p in projects"
                :key="p.id"
                :project="p"
                @liked="onLiked"
                @disliked="onDisliked"
            />
        </div>

        <div class="pagination">
            <button
                @click="load(projectStore.meta.page - 1)"
                :disabled="projectStore.meta.page <= 1"
            >
                <
            </button>
            <span>{{ projectStore.meta.page }} / {{ projectStore.meta.totalPages || '?' }}</span>
            <button
                @click="load(projectStore.meta.page + 1)"
                :disabled="projectStore.meta.totalPages && projectStore.meta.page >= projectStore.meta.totalPages"
            >
                >
            </button>
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

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
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
