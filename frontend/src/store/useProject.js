import { ref } from "vue";
import { defineStore } from "pinia";
import ProjectService from "../services/projectService";

export const useProjectStore = defineStore(
    "project",
    () => {
        const projects = ref([]);
        const loading = ref(false);
        const error = ref(null);

        async function getProjects() {
            loading.value = true;
            error.value = null;
            const res = await ProjectService.getProjects();
            if (res.success) {
                projects.value = res.projects;
            } else {
                error.value =
                    res.message || "Erreur lors de la récupération des projets";
            }
            loading.value = false;
            return res;
        }

        async function likeProject(projectId) {
            loading.value = true;
            error.value = null;
            const res = await ProjectService.likeProject(projectId);
            if (res.success) {
                const index = projects.value.findIndex(
                    (p) => p.id === projectId
                );
                if (index !== -1) {
                    projects.value[index].likes = res.likes;
                }
            } else {
                error.value = res.message || "Erreur lors de l'ajout du like";
            }
            loading.value = false;
            return res;
        }

        async function dislikeProject(projectId) {
            loading.value = true;
            error.value = null;
            const res = await ProjectService.dislikeProject(projectId);
            if (res.success) {
                const index = projects.value.findIndex(
                    (p) => p.id === projectId
                );
                if (index !== -1) {
                    projects.value[index].dislikes = res.dislikes;
                }
            } else {
                error.value =
                    res.message || "Erreur lors de l'ajout du dislike";
            }
            loading.value = false;
            return res;
        }

        return {
            projects,
            loading,
            error,
            getProjects,
            likeProject,
            dislikeProject,
        };
    },
    { persist: true }
);

export default useProjectStore;
