import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import ProjectDetail from "../views/ProjectDetail.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Profile from "../views/Profile.vue";
import { useUserStore } from "../store/useUser";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/project/:id",
        name: "ProjectDetail",
        component: ProjectDetail,
        props: true,
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
    },
    {
        path: "/profile",
        name: "Profile",
        component: Profile,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    if (to.meta.requiresAuth && !userStore.user) {
        next({ name: "Login", query: { redirect: to.fullPath } });
    } else {
        next();
    }
});

export default router;
