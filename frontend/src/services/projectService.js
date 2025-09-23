import { apiRequest } from "./apiRequest";
import { useUserStore } from "../store/useUser";

// Global
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Prefix
const PROJECT_PREFIX = `${API_URL}/v1/projects`;

// URLs
const GET_PROJECTS_URL = PROJECT_PREFIX;

const LIKE_PROJECT_URL = (id) => `${PROJECT_PREFIX}/${id}/like`;
const DISLIKE_PROJECT_URL = (id) => `${PROJECT_PREFIX}/${id}/dislike`;

export class ProjectService {
    static API_URL = API_URL;
    static GET_PROJECTS_URL = GET_PROJECTS_URL;

    static async getProjects({ page = 1, limit = 9 } = {}) {
        const params = new URLSearchParams({ limit, page }).toString();
        const res = await apiRequest(`${GET_PROJECTS_URL}?${params}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (res.success) {
            const { projects = [], meta = {} } = res.data || {};
            return { success: true, projects, meta };
        }
        return {
            success: false,
            message: res.message || "Erreur lors de la récupération des projets",
        };
    }

    static async likeProject(projectId) {
        const userStore = useUserStore();
        const res = await apiRequest(
            LIKE_PROJECT_URL(projectId),
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userStore.token}`,
            },
            body: JSON.stringify({ projectId }),
        });
        return res;
    }

    static async dislikeProject(projectId) {
        const userStore = useUserStore();
        const res = await apiRequest(
            DISLIKE_PROJECT_URL(projectId),
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userStore.token}`,
            },
            body: JSON.stringify({ projectId }),
        });
        return res;
    }

    static async getProjectById(projectId) {
        const res = await apiRequest(`${GET_PROJECTS_URL}/${projectId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.success) {
            return { success: true, project: res.data };
        }
        return { success: false, message: res.message || 'Erreur lors de la récupération du projet' };
    }
}

export default ProjectService;
