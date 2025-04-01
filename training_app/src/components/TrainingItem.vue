<template>
    <div class="card">
        <div class="card-body">
            <h3 class="card-title">{{ exerciseName }}</h3>
            <p class="card-text">{{ time }}</p>
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

.card:hover {
    transform: scale(1.05);
}

.card:active {
    transform: scale(0.95);
}
</style>
