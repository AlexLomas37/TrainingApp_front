<template>
    <div class="card">
        <div class="card-body">
            <h3 class="card-title">{{ exerciseName }}</h3>
            <div class="card-text">
                <span v-if="time"><span class="material-symbols-outlined md-36">timer</span> {{ time + " min" }}</span>
                <span v-if="repetitions"><span class="material-symbols-outlined">laps</span> {{ repetitions }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TrainingItem',
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
