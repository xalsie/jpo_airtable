<script setup>
import { ref, onMounted } from "vue";
import { useProjectStore } from "../store/useProject";
import ProjectCard from "../components/ProjectCard.vue";

const projectStore = useProjectStore();

const projects = ref([]);
const test = ref([]);
const searchValue = ref("");

const load = async () => {
    projects.value = await projectStore.getProjects();

    test.value = projects.value.projects.projects
};
onMounted(load);

const search = async () => {
    // TODO: Add endpoint in back-end.
    console.log("Searching for:", searchValue.value);
    // projects.value = await projectStore.searchProjects(searchValue.value);
    // projects.value = await projectStore.getProjects();
};
const loadAll = load;

const onLiked = async (id, userLiked) => {
    // TODO: Add endpoint in back-end.
    console.log("Liked project with id:", id, userLiked);
    await projectStore.likeProject(id, userLiked);
    // await load();
};

const onDisliked = async (id, userDisliked) => {
    // TODO: Add endpoint in back-end.
    console.log("Disliked project with id:", id, userDisliked);
    await projectStore.dislikeProject(id, userDisliked);
    // await load();
};
</script>

<template>
    <div class="container">
        <div class="search">
            <input v-model="searchValue" placeholder="Recherche par mot-clé..." />
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
                v-for="p in test"
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
