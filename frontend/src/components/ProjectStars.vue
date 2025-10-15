<script setup>
import { computed } from "vue";

const props = defineProps({
    count: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        default: "#ffd700",
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

const displayValue = computed(() => {
    if (!props.displayCount) return '';
    if (props.count > 0) {
        if (Number.isInteger(props.count)) {
            return `${props.count}/10`;
        } else {
            return `${props.count.toFixed(1).replace('.', ',')}/10`;
        }
    } else {
        return 'Pas encore noté';
    }
});
</script>

<template>
    <div class="stars">
        <div class="stars-container">
            <i
                v-for="n in starsToShow"
                :key="n"
                class="pi pi-star-fill"
                :style="{ color: color }"
            ></i>
        </div>

        <div class="text-sm">
            <span v-if="displayCount">{{ displayValue }}</span>
        </div>
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

.card .stars-container i {
    position: relative;
    top: -2px;
}
</style>