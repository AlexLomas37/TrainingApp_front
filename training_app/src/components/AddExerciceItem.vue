<template>
    <div class="card">
        <h2>Ajouter un exercice</h2>
        <form @submit.prevent="submitExercice">
            <div>
                <label for="exName">Nom de l'exercice :</label>
                <input id="exName" type="text" v-model="exercice.name" required />
            </div>
            <div>
                <label for="exDesc">Description :</label>
                <textarea id="exDesc" v-model="exercice.description" required></textarea>
            </div>
            <div>
                <label for="exTime">Temps (en minutes) :</label>
                <input id="exTime" type="number" v-model="exercice.time" required />
            </div>
            <button type="submit">Ajouter l'exercice</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'AddExerciceItem',
    props: {
        trainingId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            exercice: {
                name: '',
                description: '',
                time: null
            }
        }
    },
    methods: {
        submitExercice() {
            const exerciceData = { ...this.exercice, trainingId: this.trainingId };
            console.log("Exercice soumis :", exerciceData);
            // TODO: ajouter la validation et le traitement de la soumission
        }
    }
}
</script>

<style scoped>
.card {
    padding: 1rem;
    margin: 1rem;
}
</style>
