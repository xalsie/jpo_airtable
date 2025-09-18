import bcrypt from "bcryptjs";

const STORAGE_KEYS = {
    USERS: "mp_users_v1",
    PROJECTS: "mp_projects_v1",
};

function read(key) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
}
function write(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function ensureProjects() {
    if (!read(STORAGE_KEYS.PROJECTS)) {
        const seed = [
            {
                id: "p1",
                title: "API Node.js avec AirTable",
                description:
                    "Développement d'une API Node.js intégrée à AirTable pour gérer, structurer et exposer des données dynamiques. Le projet met en avant la conception d'endpoints REST, la gestion des requêtes et l'optimisation des performances pour un usage simple dans des applications front-end.",
                tags: ["node", "api", "airtable"],
                likes: 240,
                dislikes: 18,
            },
            {
                id: "p2",
                title: "Application front-end en Vue",
                description:
                    "Réalisation d'une application front-end réactive mettant l'accent sur le design UI/UX et l'intégration fluide avec des APIs tierces. L'objectif était d'explorer des concepts modernes de développement web, en assurant accessibilité, adaptabilité et une expérience utilisateur cohérente.",
                tags: ["vue", "node", "frontend"],
                likes: 86,
                dislikes: 12,
            },
            {
                id: "p3",
                title: "Jeu vidéo in-web Three.js",
                description:
                    "Création d'un jeu web interactif en Three.js exploitant la 3D temps réel. Le projet explore la modélisation, la gestion des collisions et l'animation pour proposer une expérience ludique accessible directement depuis le navigateur, sans installation ni dépendances lourdes.",
                tags: ["js", "javascript", "threejs"],
                likes: 28,
                dislikes: 4,
            },
        ];
        write(STORAGE_KEYS.PROJECTS, seed);
    }
}
ensureProjects();

const MockApi = {
    async registerUser({ name, email, password }) {
        const users = read(STORAGE_KEYS.USERS) || [];
        if (users.find((u) => u.email === email)) {
            return { success: false, message: "Email déjà utilisé" };
        }
        const hashed = bcrypt.hashSync(password, 8);
        const user = { id: "u" + Date.now(), name, email, password: hashed };
        users.push(user);
        write(STORAGE_KEYS.USERS, users);
        const safeUser = { id: user.id, name: user.name, email: user.email };
        return { success: true, user: safeUser };
    },

    async loginUser({ email, password }) {
        const users = read(STORAGE_KEYS.USERS) || [];
        const user = users.find((u) => u.email === email);
        if (!user) return { success: false, message: "Utilisateur non trouvé" };
        const ok = bcrypt.compareSync(password, user.password);
        if (!ok) return { success: false, message: "Mot de passe incorrect" };
        const safeUser = { id: user.id, name: user.name, email: user.email };
        return { success: true, user: safeUser };
    },

    async getProjects() {
        return read(STORAGE_KEYS.PROJECTS) || [];
    },

    async getProjectById(id) {
        const projects = read(STORAGE_KEYS.PROJECTS) || [];
        return projects.find((p) => p.id === id) || null;
    },

    async likeProject(id) {
        const projects = read(STORAGE_KEYS.PROJECTS) || [];
        const p = projects.find((x) => x.id === id);
        if (!p) return { success: false, message: "Projet non trouvé" };
        p.likes = (p.likes || 0) + 1;
        write(STORAGE_KEYS.PROJECTS, projects);
        return { success: true, project: p };
    },

    async dislikeProject(id) {
        const projects = read(STORAGE_KEYS.PROJECTS) || [];
        const p = projects.find((x) => x.id === id);
        if (!p) return { success: false, message: "Projet non trouvé" };
        p.dislikes = (p.dislikes || 0) + 1;
        write(STORAGE_KEYS.PROJECTS, projects);
        return { success: true, project: p };
    },

    async searchProjects(query) {
        const q = (query || "").toLowerCase();
        const projects = read(STORAGE_KEYS.PROJECTS) || [];
        if (!q) return projects;
        return projects.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                // p.description.toLowerCase().includes(q) ||
                (p.tags || []).some((t) => t.toLowerCase().includes(q))
        );
    },

    async updateUser(id, data) {
        const users = read(STORAGE_KEYS.USERS) || [];
        const idx = users.findIndex((u) => u.id === id);
        if (idx === -1)
            return { success: false, message: "Utilisateur non trouvé" };
        users[idx] = { ...users[idx], ...data };
        write(STORAGE_KEYS.USERS, users);
        const safeUser = {
            id: users[idx].id,
            name: users[idx].name,
            email: users[idx].email,
        };
        return { success: true, user: safeUser };
    },

    async deleteUser(id) {
        let users = read(STORAGE_KEYS.USERS) || [];
        users = users.filter((u) => u.id !== id);
        write(STORAGE_KEYS.USERS, users);
        return { success: true };
    },
};

export default MockApi;
