import { apiRequest } from "./apiRequest";

// Global
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Prefix
const PROJECT_PREFIX = `${API_URL}/api/projects`;

// URLs
const GET_PROJECTS_URL = PROJECT_PREFIX;
const LIKE_PROJECT_URL = `${PROJECT_PREFIX}/like`;
const DISLIKE_PROJECT_URL = `${PROJECT_PREFIX}/dislike`;

const ProjectService = {
    API_URL,
    GET_PROJECTS_URL,

    async getProjects() {
        const res = await apiRequest(GET_PROJECTS_URL, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (res.success && Array.isArray(res.data)) {
            return { success: true, projects: res.data };
        } else {
            return {
                success: false,
                message:
                    res.message || "Erreur lors de la récupération des projets",
            };
        }
    },

    async likeProject(projectId) {
        const res = await apiRequest(LIKE_PROJECT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId }),
        });
        return res;
    },

    async dislikeProject(projectId) {
        const res = await apiRequest(DISLIKE_PROJECT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId }),
        });
        return res;
    },
};

export default ProjectService;
