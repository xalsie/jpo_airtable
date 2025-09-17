<template>
    <div v-if="project">
        <h2>{{ project.title }}</h2>
        <p>{{ project.description }}</p>
        <div>
            Tags: <span v-for="t in project.tags" :key="t">{{ t }} </span>
        </div>
        <div>Likes: {{ project.likes || 0 }}</div>
        <button @click="like">J'aime</button>
    </div>
    <div v-else>Chargement...</div>
</template>

<script>
import MockApi from "../services/mockApi";
import { ref, onMounted } from "vue";
export default {
    props: ["id"],
    setup(props) {
        const project = ref(null);
        const load = async () => {
            project.value = await MockApi.getProjectById(props.id);
        };
        onMounted(load);
        const like = async () => {
            await MockApi.likeProject(props.id);
            await load();
        };
        return { project, like };
    },
};
</script>
