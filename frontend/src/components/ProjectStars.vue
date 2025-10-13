<script setup>
import { computed } from "vue";

const props = defineProps({
    count: {
        type: Number,
        required: true,
    },
    displayCount: {
        type: Boolean,
        default: true,
    },
    showSingleStar: {
        type: Boolean,
        default: false,
    }
});

const starsToShow = computed(() => {
    if (props.showSingleStar) return 1;
    return Math.round(props.count);
});
</script>

<template>
    <div class="stars">
        <div class="stars-container">
            <i
                v-for="n in starsToShow"
                :key="n"
                class="pi pi-star-fill"
            ></i>
        </div>
        <span v-if="displayCount" class="text-sm">{{ count.toFixed(1) }}</span>
    </div>
</template>

<style scoped>
.stars {
    display: flex;
    align-items: center;
    gap: 8px;
}

.stars-container {
    display: flex;
    align-items: center;
    gap: 4px;
}

.stars-container i {
    color: #ffd700;
    position: relative;
    top: -2px;
}
</style>