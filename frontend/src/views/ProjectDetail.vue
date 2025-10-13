<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import ProjectService from "../services/projectService";
import ProjectStars from '../components/ProjectStars.vue';

const route = useRoute();
const project = ref(null);
const loading = ref(false);

const load = async () => {
    loading.value = true;
    const id = route.params.id;
    const res = await ProjectService.getProjectById(id);
    if (res.success) {
        project.value = res.project;
    } else {
        project.value = null;
    }
    loading.value = false;
};
onMounted(load);

const like = async () => {
    if (!project.value) return;
    await ProjectService.likeProject(project.value.id);
    await load();
};

const dislike = async () => {
    if (!project.value) return;
    await ProjectService.dislikeProject(project.value.id);
    await load();
};
</script>

<template>
    <div v-if="project" class="container">
        <article>
            <div class="image-wrapper">
                <img
                    :src="Array.isArray(project.image) && project.image.length > 0 ? project.image[0].url : '/assets/images/image_404_not_found.webp'"
                    :alt="project.title || 'Image du projet'"
                />
            </div>

            <div class="content-wrapper">
                <div class="tags">
                    <span v-for="t in project.tags || []" :key="t" class="tag">
                        {{ t }}
                    </span>
                </div>

                <h1 class="title">
                    <router-link :to="'/project/' + project.id">
                        {{ project.title }}
                    </router-link>
                </h1>

                <p class="description">{{ project.description }}</p>

                <div v-if="project.averageGrade && project.averageGrade !== ''">
                    <table>
                        <tbody>
                            <tr v-if="project.averageGrade">
                                <td>Note globale</td>
                                <td>
                                    <ProjectStars
                                        :count="project.averageGrade"
                                        :displayCount="false"
                                        :showSingleStar="false"
                                    />
                                </td>
                            </tr>
                            <tr v-if="project.averageUXUIGrade">
                                <td>Note UI/UX</td>
                                <td>
                                    <ProjectStars
                                        :count="project.averageUXUIGrade"
                                        :displayCount="false"
                                        :showSingleStar="false"
                                    />
                                </td>
                            </tr>
                            <tr v-if="project.averageCleanCodeGrade">
                                <td>Note Clean Code</td>
                                <td>
                                    <ProjectStars
                                        :count="project.averageCleanCodeGrade"
                                        :displayCount="false"
                                        :showSingleStar="false"
                                    />
                                </td>
                            </tr>
                            <tr v-if="project.averageFeaturesGrade">
                                <td>Note Fonctionnalités</td>
                                <td>
                                    <ProjectStars
                                        :count="project.averageFeaturesGrade"
                                        :displayCount="false"
                                        :showSingleStar="false"
                                    />
                                </td>
                            </tr>
                            <tr v-if="project.averageInnovationGrade">
                                <td>Note Innovation</td>
                                <td>
                                    <ProjectStars
                                        :count="project.averageInnovationGrade"
                                        :displayCount="false"
                                        :showSingleStar="false"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="actions">
                    <div class="action">
                        <i @click="like" class="pi pi-thumbs-up-fill"></i>
                        <span>{{ project.likes || 0 }}</span>
                    </div>

                    <div class="action">
                        <i @click="dislike" class="pi pi-thumbs-down-fill"></i>
                        <span>{{ project.dislikes || 0 }}</span>
                    </div>
                </div>
            </div>
        </article>
    </div>

    <div v-else class="container space center">
        <p>Chargement...</p>
    </div>
</template>

<style scoped>
article {
    display: flex;
    align-items: stretch;
}

.image-wrapper {
    flex: 0 0 50%;
    height: 100%;
}

.image-wrapper img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    border-radius: 12px;
    object-position: center;
}

.content-wrapper {
    flex: 0 0 50%;
    padding: 16px 24px;
    box-sizing: border-box;
    overflow: auto;

    display: flex;
    flex-direction: column;
    gap: 20px;
}

.title {
    font-family: "Fraunces";
}

.description {
    line-height: 1.6;
    text-align: justify;
}

.tags {
    display: flex;
    gap: 20px;
}

.tag {
    padding: 6px 10px;
    font-size: 12px;
    text-transform: uppercase;
    border: 1px solid var(--dark-gray);
    border-radius: 6px;
}

.actions {
    display: flex;
    align-items: center;
    gap: 20px;
}

.action {
    display: flex;
    align-items: center;
    gap: 8px;
}

.action i {
    padding: 8px;
    font-size: 14px;
    color: var(--white);
    background-color: var(--dark-gray);
    border-radius: 9999px;
    cursor: pointer;
}
</style>
