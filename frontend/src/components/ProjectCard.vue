<script setup>
import { computed } from "vue";
import useUserStore from "../store/useUser";

const props = defineProps({
    project: {
        type: Object,
        required: true,
    },
    showGoBack: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["liked", "disliked"]);

const userStore = useUserStore();

const userId = computed(() => userStore.data?.id || null);

const userLiked = computed(() => {
    if (!props.project || !props.project.activities || !userId.value) return false;
    return props.project.activities.some((a) => a.type === 'like' && (Array.isArray(a.author) ? a.author.includes(userId.value) : a.author === userId.value));
});

const userDisliked = computed(() => {
    if (!props.project || !props.project.activities || !userId.value) return false;
    return props.project.activities.some((a) => a.type === 'dislike' && (Array.isArray(a.author) ? a.author.includes(userId.value) : a.author === userId.value));
});

const like = async () => {
    emit("liked", props.project.id, userLiked.value);
};

const dislike = async () => {
    emit("disliked", props.project.id, userDisliked.value);
};
</script>

<template>
    <article class="card">
        <div class="image-wrapper">
            <img
                :src="Array.isArray(project.image) && project.image.length > 0 ? project.image[0].url : '/assets/images/example.jpg'"
                :alt="project.title || 'Image du projet'"
            />
        </div>

        <div class="content-wrapper">
            <div class="tags">
                <span v-for="t in project.tags" :key="t" class="tag">
                    {{ t }}
                </span>
            </div>

            <h2 class="title">
                <router-link :to="'/project/' + project.id">
                    {{ project.title }}
                </router-link>
            </h2>

            <div class="footer">
                <div class="actions">
                    <div class="action">
                        <i
                            @click="like"
                            :class="['pi', 'pi-thumbs-up-fill', 'like', { 'active': userLiked }]"
                            aria-hidden="true"
                        ></i>
                        <span class="count">{{ project.likes || 0 }}</span>
                    </div>

                    <div class="action">
                        <i
                            @click="dislike"
                            :class="['pi', 'pi-thumbs-down-fill', 'dislike', { 'active': userDisliked }]"
                            aria-hidden="true"
                        ></i>
                        <span class="count">{{ project.dislikes || 0 }}</span>
                    </div>
                </div>

                <button v-if="showGoBack" class="primary go-back">
                    <router-link :to="'/'" class="go-back-link">
                        Retour
                    </router-link>
                </button>
            </div>
        </div>
    </article>
</template>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: var(--card-bg, #fff);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 18px rgba(28, 40, 50, 0.06);
    height: 100%;
}

.image-wrapper {
    width: 100%;
    height: 240px;
    overflow: hidden;
    background: #f2f2f2;
}

.image-wrapper img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
}

.content-wrapper {
    padding: 12px 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.tag {
    padding: 4px 8px;
    font-size: 11px;
    text-transform: uppercase;
    border: 1px solid var(--dark-gray, #d2d2d2);
    border-radius: 6px;
    background: var(--tag-bg, transparent);
    color: var(--text, #111);
    line-height: 1;
}

.title {
    display: flex;
    font-family: "Fraunces", serif;
    font-size: 20px;
    line-height: 1.2;
}

.title a {
    width: 100%;
    color: inherit;
    text-decoration: none;
}

.description {
    font-size: 13px;
    line-height: 1.4;
    color: var(--muted, #55606a);
    margin: 0;
    text-align: justify;
}

.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.action {
    display: flex;
    align-items: center;
    gap: 8px;
}

.action i {
    padding: 6px;
    font-size: 13px;
    color: var(--white, #fff);
    background-color: var(--dark-gray, #30343a);
    border-radius: 9999px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease-in-out;
}

.action i.like:hover {
    background-color: green;
}

.action i.dislike:hover {
    background-color: red;
}

.action i.active.like {
    background-color: green;
}

.action i.active.dislike {
    background-color: red;
}

.count {
    font-size: 12px;
}

.go-back {
    background: transparent;
    border: none;
    padding: 6px 10px;
    cursor: pointer;
    border-radius: 8px;
}

.go-back-link {
    color: var(--primary, #0b69ff);
    text-decoration: none;
    font-size: 13px;
}

.go-back:focus,
.go-back:active {
    outline: none;
}

@media (max-width: 640px) {
    .image-wrapper {
        height: 220px;
    }

    .title {
        font-size: 15px;
    }

    .tag {
        font-size: 10px;
        padding: 3px 6px;
    }
}
</style>
