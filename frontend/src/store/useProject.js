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
        const meta = ref({ page: 1, limit: 9, total: 0, totalPages: 0, offset: 0 });

        const userStore = useUserStore();
        const userId = computed(() => userStore.data?.id || null);

        async function getProjects(page = 1, limit = 9) {
            loading.value = true;
            error.value = null;
            const res = await ProjectService.getProjects({ page, limit });
            if (res.success) {
                projects.value = res.projects;
                meta.value = { ...(meta.value || {}), ...(res.meta || { page, limit }) };
            } else {
                error.value = res.message || "Erreur lors de la récupération des projets";
            }
            loading.value = false;
            return res;
        }

        function setPage(newPage) {
            const limit = meta.value.limit || 9;
            return getProjects(newPage, limit);
        }

        function nextPage() {
            const p = (meta.value.page || 1) + 1;
            if (meta.value.totalPages && p > meta.value.totalPages) return null;
            return setPage(p);
        }

        function prevPage() {
            const p = Math.max(1, (meta.value.page || 1) - 1);
            return setPage(p);
        }

        async function likeProject(projectId, userLiked) {
            loading.value = true;
            error.value = null;
            const likeAction = await ProjectService.likeProject(projectId);
            if (likeAction?.success === false) {
                loading.value = false;
                return;
            }

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
            const dislikeAction = await ProjectService.dislikeProject(projectId);
            if (dislikeAction?.success === false) {
                loading.value = false;
                return;
            }

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
            meta,
            getProjects,
            setPage,
            nextPage,
            prevPage,
            likeProject,
            dislikeProject,
        };
    },
    { persist: true }
);

export default useProjectStore;
