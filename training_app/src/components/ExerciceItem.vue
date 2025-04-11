<template>
    <div class="card">
        <div class="card-body">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 class="card-title">{{ exerciseName }}</h3>
                    <div class="card-text">
                        <span v-if="time">
                            <span class="material-symbols-outlined md-36">timer</span> {{ time + " min" }}
                        </span>
                        <span v-if="repetitions">
                            <span class="material-symbols-outlined">laps</span> {{ repetitions }}
                        </span>
                    </div>
                </div>
                <div v-if="editMode" style="display: flex; gap: 10px;">
                    <GenericButton icon="delete" color="red" type="button" @click="$emit('click')" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GenericButton from '@/components/utils/GenericButton.vue';

export default {
    name: 'TrainingItem',
    components: {
        GenericButton
    },
    props: {
        exerciseName: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        repetitions: {
            type: String,
            required: true
        },
        editMode: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped>
.card {
    border: 1px solid rgb(43, 43, 43);
    background-color: rgb(43, 43, 43);
    border-radius: 15px;
    padding: 1rem;
    margin: 0.5rem;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease;
}

.card-text span {
    display: inline-flex;
    align-items: center;
    margin-right: 5px;
}

.card:hover {
    transform: scale(1.05);
}

.card:active {
    transform: scale(0.95);
}
</style>
