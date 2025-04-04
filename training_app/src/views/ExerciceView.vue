<template>
    <div v-if="visible" class="exercice-card card">
        <div class="card-header">
            <!-- Bouton ajouté pour fermer la page -->
            <button class="close-btn" @click="closePage">X</button>
            <h1>{{ exercice.name }}</h1>
        </div>
        <div class="card-body">
            <div style="display: flex; align-items: center; margin-bottom: 1em;">
                <span style="margin-right: 20px;">
                    <strong>Temps:</strong> {{ exercice.time }} min
                </span>
                <span>
                    <strong>Répétitions:</strong> {{ exercice.repetitions }}
                </span>
            </div>
            <h3>Description</h3>
            <p class="card-text">{{ exercice.description }}</p>
            <h3>Informations</h3>
            <h3>Statistiques récoltés</h3>
            <ul>
                <li v-for="(stat, index) in exercice.statisticsMap" :key="index">
                    {{ index + " en " + stat }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "ExerciceView",
    props: {
        visible: {
            type: Boolean,
            default: true
        },
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
    methods: {
        closePage() {
            this.$emit('close');
        }
    }
};
</script>

<style scoped>
.exercice-card {
    border-radius: 8px;
    width: 100%;
    height: 100%;
    margin: 20px auto;
    position: relative;
    box-sizing: border-box;
}

.card-header {
    display: flex;
    align-items: center;
    /* vertically centers the title and button */
    justify-content: center;
    /* centers the title horizontally */
    border-bottom: 1px solid #ccc;
    padding: 10px 20px;
    margin-bottom: 15px;
    position: relative;
}

.close-btn {
    position: absolute;
    top: 50%;
    /* center vertically */
    right: 10px;
    transform: translateY(-50%);
    /* adjust for perfect centering */
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
}
</style>
