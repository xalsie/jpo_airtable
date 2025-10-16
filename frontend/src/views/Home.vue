<script setup>
import { ref, onMounted } from "vue";
import { useProjectStore } from "../store/useProject";
import ProjectService from "../services/projectService";
import ProjectCard from "../components/ProjectCard.vue";
import ProjectCardSkeleton from "../components/ProjectCardSkeleton.vue";

const projectStore = useProjectStore();
const projects = ref([]);
const projectMeta = ref({});
const showEmptyMessage = ref(false);
const loading = ref(true);

const searchValue = ref("");

const search = async (page = 1) => {
    showEmptyMessage.value = false;
    loading.value = true;
    const res = await ProjectService.searchProjects({
        query: searchValue.value,
        page: (typeof page === 'number' && page > 0) ? page : 1,
        limit: projectStore.meta?.limit || 9,
    });
    if (res.success) {
        projects.value = res.projects;
        projectMeta.value = res.meta;
        loading.value = false;
    } else {
        projects.value = [];
        loading.value = false;
    }
};

const load = async (page = 1) => {
    showEmptyMessage.value = false;
    loading.value = true;
    const res = await projectStore.getProjects(page, projectStore.meta?.limit || 9);
    if (res.success) {
        projects.value = projectStore.projects;
        projectMeta.value = projectStore.meta;
        loading.value = false;
    } else {
        projects.value = [];
        loading.value = false;
    }

    if (projects.value.length === 0) {
        setTimeout(() => {
            if (projects.value.length === 0) showEmptyMessage.value = true;
        }, 2000);
    }
};

onMounted(() => {
    setTimeout(() => load(), 0);
});

const onLiked = async (id, userLiked) => {
    await projectStore.likeProject(id, userLiked);
};

const onDisliked = async (id, userDisliked) => {
    await projectStore.dislikeProject(id, userDisliked);
};

const resetSearch = () => {
    searchValue.value = "";
    load();
};

const loadPagination = (page) => {
    console.log("load page", page);
    if (searchValue.value) {
        search(page);
    } else {
        load(page);
    }
};
</script>

<template>
    <div class="container">
        <div class="search">
            <input v-model="searchValue" placeholder="Recherche par mot-clé..." />
            <button @click="search">
                <i class="pi pi-search"></i>
            </button>
            <button @click="resetSearch" v-if="searchValue">
                <i class="pi pi-times"></i>
            </button>
        </div>

        <div v-if="projects.length === 0 && showEmptyMessage">
            <span>Aucun projet enregistré.</span>
        </div>

        <div v-else class="projects">
            <ProjectCardSkeleton
                v-if="loading"
                :NumberOfCards="9"
            />
            <ProjectCard
                v-else
                v-for="p in projects"
                :key="p.id"
                :project="p"
                @liked="onLiked"
                @disliked="onDisliked"
            />
        </div>

        <div class="pagination">
            <button
                @click="loadPagination(projectMeta.page - 1)"
                :disabled="projectMeta.page == 1"
            >
                <
            </button>
            <span>{{ projectMeta.page || '1' }} / {{ projectMeta.totalPages || '1' }}</span>
            <button
                @click="loadPagination(projectMeta.page + 1)"
                :disabled="projectMeta.totalPages < 1 && projectMeta.page >= projectMeta.totalPages"
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
