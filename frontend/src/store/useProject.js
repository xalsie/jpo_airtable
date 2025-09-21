import { ref, computed } from "vue";
import { defineStore } from "pinia";
import ProjectService from "../services/projectService";
import useUserStore from './useUser';

export const useProjectStore = defineStore(
    "project",
    () => {
        const projects = ref([]);
        const loading = ref(false);
        const error = ref(null);

        const userStore = useUserStore();
        const userId = computed(() => userStore.data?.id || null);

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

        async function likeProject(projectId, userLiked) {
            loading.value = true;
            error.value = null;
            ProjectService.likeProject(projectId);
            const list = projects.value?.projects || projects.value || [];
            const index = list.findIndex(p => p.id === projectId);
            if (index !== -1) {
                list[index].likes = list[index].likes || 0;
                list[index].dislikes = list[index].dislikes || 0;

                if (userLiked) {
                    list[index].likes = Math.max(0, list[index].likes - 1);
                    list[index].activities = list[index].activities.filter(a => !(a.type === 'like' && (Array.isArray(a.author) ? a.author.includes(userId.value) : a.author === userId.value)));
                } else {
                    list[index].likes += 1;
                    list[index].activities.push({ id: `local-${Date.now()}`, type: 'like', author: [userId.value] });

                    const hadDislike = list[index].activities.some(a => a.type === 'dislike' && (Array.isArray(a.author) ? a.author.includes(userId.value) : a.author === userId.value));
                    if (hadDislike) {
                        list[index].activities = list[index].activities.filter(a => !(a.type === 'dislike' && (Array.isArray(a.author) ? a.author.includes(userId.value) : a.author === userId.value)));
                        list[index].dislikes = Math.max(0, list[index].dislikes - 1);
                    }
                }
            }
            loading.value = false;
        }

        async function dislikeProject(projectId, userDisliked) {
            loading.value = true;
            error.value = null;
            ProjectService.dislikeProject(projectId);
            const list = projects.value?.projects || projects.value || [];
            const index = list.findIndex(p => p.id === projectId);
            if (index !== -1) {
                list[index].dislikes = list[index].dislikes || 0;
                list[index].likes = list[index].likes || 0;

                if (userDisliked) {
                    list[index].dislikes = Math.max(0, list[index].dislikes - 1);
                    list[index].activities = list[index].activities.filter(a => !(a.type === 'dislike' && (Array.isArray(a.author) ? a.author.includes(userId.value) : a.author === userId.value)));
                } else {
                    list[index].dislikes += 1;
                    list[index].activities.push({ id: `local-${Date.now()}`, type: 'dislike', author: [userId.value] });

                    const hadLike = list[index].activities.some(a => a.type === 'like' && (Array.isArray(a.author) ? a.author.includes(userId.value) : a.author === userId.value));
                    if (hadLike) {
                        list[index].activities = list[index].activities.filter(a => !(a.type === 'like' && (Array.isArray(a.author) ? a.author.includes(userId.value) : a.author === userId.value)));
                        list[index].likes = Math.max(0, list[index].likes - 1);
                    }
                }
            }
            loading.value = false;
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
