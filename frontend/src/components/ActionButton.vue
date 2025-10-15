<script setup>
import { computed } from 'vue';
import useUserStore from '../store/useUser';

const props = defineProps({
    type: {
        type: String,
        required: true,
        validator: value => ['like', 'dislike'].includes(value),
    },
    countToDisplay: {
        type: Number,
        required: false,
        default: 0,
    },
    project: {
        type: Object,
        required: true,
    }
});

const emit = defineEmits(["clicked"]);

const userStore = useUserStore();

const userId = computed(() => userStore.data?.id || null);

const userInteracted = computed(() =>
    !!props.project?.activities?.some(
        activity =>
            activity.type === props.type &&
            activity.author.includes(userId.value)
    )
);

const click = async () => {
    emit('clicked', props.project.id, userInteracted.value);
};
</script>

<template>
    <div :class="['action', props.type, { active: userInteracted }]" @click="click">
        <i class="pi pi-thumbs-up-fill"></i>
        <span>{{ countToDisplay }}</span>
    </div>
</template>

<style scoped>
.action {
    display: flex;
    align-items: center;
    gap: 8px;

    font-size: 14px;
    padding: 14px 20px;
    cursor: pointer;
    border-radius: 12px;

    color: var(--white);
    background-color: var(--darker-gray);
}

.action.like.active {
    color: var(--white);
    background-color: var(--green);
}

.action.dislike.active {
    color: var(--white);
    background-color: var(--red);
}
</style>