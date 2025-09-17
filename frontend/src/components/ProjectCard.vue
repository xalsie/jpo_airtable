<template>
    <article>
        <div class="image-wrapper">
            <img src="/assets/images/example.jpg" alt="Image d'exemple" />
        </div>

        <div class="content-wrapper">
            <div class="tags">
                <span v-for="t in project.tags" :key="t" class="tag"
                    >{{ t }}
                </span>
            </div>

            <h1 class="title">
                <router-link :to="'/project/' + project.id">
                    {{ project.title }}
                </router-link>
            </h1>

            <p class="description">{{ project.description }}</p>

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
</template>

<script>
export default {
    props: { project: Object },
    methods: {
        async like() {
            this.$emit("liked", this.project.id);
        },

        async dislike() {
            this.$emit("disliked", this.project.id);
        },
    },
};
</script>

<style scoped>
article {
    display: flex;
    height: 400px;
    overflow: hidden;
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
    font-size: 14px;
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
