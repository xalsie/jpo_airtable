import { createApp } from "vue";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";

import router from "./router";
import App from "./App.vue";

import "normalize.css";
import "primeicons/primeicons.css";

const app = createApp(App);
const pinia = createPinia();

pinia.use(
    createPersistedState({
        storage: sessionStorage,
        key: (id) => `__persisted__${id}`,
    })
);

app.use(pinia);
app.use(router);

app.mount("#app");
