<template>
    <div class="exercice-card card">
        <div class="card-header">
            {{ exercice.name }}
        </div>
        <div class="card-body">
            <p class="card-text">{{ exercice.description }}</p>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><strong>Temps:</strong> {{ exercice.time }} min</li>
                <li class="list-group-item"><strong>Répétitions:</strong> {{ exercice.repetition }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "ExerciceView",
    props: {
        exercice: {
            type: Object,
            default: () => ({
                name: "Nom de l'exercice",
                description: "Description de l'exercice",
                time: "00:00",
                repetition: 0,
            })
        }
    },
};
</script>

<style scoped>
.exercice-card {
    border-radius: 8px;
    max-width: 400px;
    margin: 20px auto;
}
</style>
