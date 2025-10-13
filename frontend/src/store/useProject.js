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

            const result = await ProjectService.likeProject(projectId);
            if (!result?.success) {
                loading.value = false;
                return;
            }

            const list = projects.value?.projects || projects.value || [];
            const project = list.find(p => p.id === projectId);
            if (!project) {
                loading.value = false;
                return;
            }

            project.likes = project.likes || 0;
            project.dislikes = project.dislikes || 0;
            project.activities = project.activities || [];

            if (userLiked) {
                project.likes = Math.max(0, project.likes - 1);
                project.activities = project.activities.filter(
                    a => !(a.type === 'like' && [a.author].flat().includes(userId.value))
                );
            } else {
                project.likes += 1;
                project.activities.push({ id: `local-${Date.now()}`, type: 'like', author: [userId.value] });

                if (project.activities.some(a => a.type === 'dislike' && [a.author].flat().includes(userId.value))) {
                    project.activities = project.activities.filter(
                        a => !(a.type === 'dislike' && [a.author].flat().includes(userId.value))
                    );
                    project.dislikes = Math.max(0, project.dislikes - 1);
                }
            }

            loading.value = false;
        }

        async function dislikeProject(projectId, userDisliked) {
            loading.value = true;
            error.value = null;

            const result = await ProjectService.dislikeProject(projectId);
            if (!result?.success) {
                loading.value = false;
                return;
            }

            const list = projects.value?.projects || projects.value || [];
            const project = list.find(p => p.id === projectId);
            if (!project) {
                loading.value = false;
                return;
            }

            project.dislikes = project.dislikes || 0;
            project.likes = project.likes || 0;
            project.activities = project.activities || [];

            if (userDisliked) {
                project.dislikes = Math.max(0, project.dislikes - 1);
                project.activities = project.activities.filter(
                    a => !(a.type === 'dislike' && [a.author].flat().includes(userId.value))
                );
            } else {
                project.dislikes += 1;
                project.activities.push({ id: `local-${Date.now()}`, type: 'dislike', author: [userId.value] });

                if (project.activities.some(a => a.type === 'like' && [a.author].flat().includes(userId.value))) {
                    project.activities = project.activities.filter(
                        a => !(a.type === 'like' && [a.author].flat().includes(userId.value))
                    );
                    project.likes = Math.max(0, project.likes - 1);
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
