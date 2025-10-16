<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProjectStore } from "../store/useProject";
import ProjectStars from '../components/ProjectStars.vue';
import ActionButton from '../components/ActionButton.vue';

const projectStore = useProjectStore();

const route = useRoute();
const project = ref(null);
const loading = ref(false);

const load = async () => {
    loading.value = true;
    const id = route.params.id;
    const res = await projectStore.getProjectById(id);
    if (res.success) {
        project.value = res.project;
    } else {
        project.value = null;
    }
    loading.value = false;
};
onMounted(() => load());

const onLiked = async (id, userLiked) => {
    await projectStore.likeProject(id, userLiked);
};

const onDisliked = async (id, userDisliked) => {
    await projectStore.dislikeProject(id, userDisliked);
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
                <div class="keywords">
                    <span v-for="t in project.keywords || []" :key="t" class="keyword">
                        {{ t }}
                    </span>
                </div>

                <div class="header">
                    <h1 class="title">{{ project.title }}</h1>
                    <ProjectStars
                        v-if="project.averageGrade"
                        :count="project.averageGrade"
                        :displayCount="false"
                        :showSingleStar="false"
                    />
                </div>

                <div v-if="project.averageGrade && project.averageGrade !== ''">
                    <table>
                        <tbody>
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

                <p class="description">{{ project.description }}</p>

                <div class="actions">
                    <ActionButton
                        type="like"
                        :project="project"
                        :countToDisplay="project.likes"
                        @clicked="onLiked"
                    />

                    <ActionButton
                        type="dislike"
                        :project="project"
                        :countToDisplay="project.dislikes"
                        @clicked="onDisliked"
                    />
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

.header {
    display: flex;
    align-items: center;
    gap: 20px;
}

.title {
    font-family: "Fraunces";
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
}

th, td {
  padding: 10px 14px;
  text-align: left;
  font-size: 14px;
  border-bottom: 1px solid var(--dark-gray);
}

th {
  font-weight: 700;
  letter-spacing: 0.02em;
  border-bottom: 2px solid var(--dark-gray);
}

tr:last-child td {
  border-bottom: none;
}

td {
  color: var(--darker-gray);
  vertical-align: middle;
}

tr {
  transition: background 0.15s;
}

tr:hover {
  background: #f6f6f6;
}

caption {
  caption-side: bottom;
  font-size: 13px;
  color: #888;
  padding: 8px 0 0 0;
  letter-spacing: 0.01em;
}

.description {
    line-height: 1.5;
    text-align: justify;
}

.keywords {
    display: flex;
    gap: 20px;
}

.keyword {
    padding: 6px 10px;
    font-size: 12px;
    text-transform: uppercase;
    border: 1px solid var(--dark-gray);
    border-radius: 6px;
}

.actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

</style>
