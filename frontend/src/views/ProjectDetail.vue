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

<script>
import MockApi from "../services/mockApi";
import ProjectCard from "../components/ProjectCard.vue";
import { ref, onMounted } from "vue";

export default {
    props: ["id"],
    components: { ProjectCard },
    setup(props) {
        const project = ref(null);

        const load = async () => {
            project.value = await MockApi.getProjectById(props.id);
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

        return { project, onLiked, onDisliked };
    },
};
</script>
