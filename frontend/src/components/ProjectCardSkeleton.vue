<script lang="ts" setup>
    import { defineProps } from 'vue';
    import ProjectStars from './ProjectStars.vue';

    const props = defineProps({
        NumberOfCards: {
            type: Number,
            default: 1
        },
    });
</script>

<template>
    <article v-for="i in props.NumberOfCards" :key="i" class="card">
        <div class="image-wrapper skeleton-animated skeleton-image"></div>

        <div class="content-wrapper">
            <div class="keywords">
                <span class="skeleton-animated skeleton-keyword" v-for="j in 3" :key="j"></span>
            </div>

            <h2 class="title skeleton-animated skeleton-title"></h2>

            <div class="footer">
                <div>
                    <ProjectStars
                        :count="0"
                        :displayCount="false"
                        :showSingleStar="true"
                        :color="'#d2d2d2'"
                    />
                </div>

                <div class="actions">
                    <div class="action">
                        <i class="pi pi-thumbs-up-fill like" aria-hidden="true"></i>
                        <span class="text-sm">-</span>
                    </div>

                    <div class="action">
                        <i class="pi pi-thumbs-down-fill dislike" aria-hidden="true"></i>
                        <span class="text-sm">-</span>
                    </div>
                </div>
            </div>
        </div>
    </article>
</template>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 18px rgba(28, 40, 50, 0.06);
    height: 100%;
}

.image-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--lighter-gray);
}

.image-wrapper img {
    width: 330px;
    height: 240px;
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

.keywords {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.keyword {
    padding: 4px 8px;
    font-size: 11px;
    text-transform: uppercase;
    border: 1px solid var(--dark-gray);
    border-radius: 6px;
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

.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.action {
    display: flex;
    align-items: center;
    gap: 2px;
    cursor: pointer;
}

.action i {
    padding: 6px;
    font-size: 13px;
    color: var(--dark-gray);
    transition: color 0.3s ease-in-out;
}

.action:hover i.like {
    color: var(--green);
}

.action:hover i.dislike {
    color: var(--red);
}

.action.active i.like {
    color: var(--green);
}

.action.active i.dislike {
    color: var(--red);
}

@media (max-width: 640px) {
    .image-wrapper {
        height: 220px;
    }

    .title {
        font-size: 15px;
    }

    .keyword {
        font-size: 10px;
        padding: 3px 6px;
    }
}


.skeleton-card {
    min-height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.skeleton-animated {
    background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.2s infinite linear;
    border-radius: 6px;
}
/*
    color svg animated
*/
.skeleton-animated-stars {
    color: transparent;
    background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
}

@keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
.skeleton-image {
    width: 100%;
    height: 240px;
}
.skeleton-keyword {
    display: inline-block;
    width: 60px;
    height: 21px;
    margin-right: 8px;
}
.skeleton-title {
    width: 70%;
    height: 24px;
    margin-bottom: 12px;
}
.skeleton-label {
    width: 100px;
    height: 18px;
}
.skeleton-description {
    width: 100%;
    height: 48px;
    margin: 16px 0;
}
.skeleton-action {
    width: 40px;
    height: 40px;
    display: inline-block;
    margin-right: 16px;
}
</style>