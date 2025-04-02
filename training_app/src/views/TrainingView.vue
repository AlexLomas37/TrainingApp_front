<template>
    <div class="container">
        <div v-if="training">
            <h1>{{ training.name }}</h1>
            <p>{{ training.description }}</p>
            <!-- Nouveau container pour le titre et le bouton -->
            <div class="header-container">
                <h2>Liste des exercices</h2>
                <GenericButton desktopText="Ajouter un exercice" mobileText="+" color="#4caf50" type="button"
                    @click="addExercise" />
            </div>
            <div v-if="training.exercices && training.exercices.length">
                <TrainingItem v-for="(exercice, index) in training.exercices" :key="index" :exerciseName="exercice.name"
                    :time="exercice.time" @click="openExercicePopup(exercice)" />
            </div>
            <div v-else>
                <p>Aucun exercice trouvé.</p>
            </div>
            <GenericButton desktopText="Retour" mobileText="Retour" color="#4caf50" type="button" @click="goBack" />
        </div>
        <div v-else>
            Chargement en cours...
        </div>

        <!-- Popup pour afficher ExerciceView -->
        <div v-if="showPopup" class="popup-overlay" @click.self="closePopup">
            <div class="popup-content">
                <ExerciceView :exercice="selectedExercice" />
                <GenericButton desktopText="Fermer" mobileText="Fermer" color="#f44336" type="button"
                    @click="closePopup" />
            </div>
        </div>

        <!-- Popup pour l'ajout d'un exercice -->
        <div v-if="showAddExercicePopup" class="popup-overlay" @click.self="closeAddExercicePopup">
            <div class="popup-content">
                <AddExerciceItem :trainingId="training.id" @exercice-added="handleExerciceAdded"
                    @close="closeAddExercicePopup" />
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GenericButton from '@/components/utils/GenericButton.vue';
import TrainingItem from '@/components/TrainingItem.vue';
import ExerciceView from '@/views/ExerciceView.vue';
import AddExerciceItem from '@/components/AddExerciceItem.vue';

// Constante globale pour l'API
const BASE_API_URL = import.meta.env.DEV ? '/api' : `${import.meta.env.VITE_API_URL}`;

export default {
    components: {
        GenericButton,
        TrainingItem,
        ExerciceView,
        AddExerciceItem
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const training = ref(null);
        const showPopup = ref(false);
        const selectedExercice = ref(null);
        const showAddExercicePopup = ref(false);

        const fetchTraining = async () => {
            const id = route.params.id;
            const apiUrl = `${BASE_API_URL}/trainings/${id}`;
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Error fetching training');
                }
                training.value = await response.json();

                console.log('Training data:', training.value);
            } catch (error) {
                console.error('Error fetching training:', error);
            }
        };

        const goBack = () => {
            router.back();
        };

        const addExercise = () => {
            showAddExercicePopup.value = true;
        };

        const closeAddExercicePopup = () => {
            showAddExercicePopup.value = false;
        };

        const handleExerciceAdded = (newExercice) => {
            if (!training.value.exercices) {
                training.value.exercices = [];
            }
            training.value.exercices = [...training.value.exercices, newExercice];
            closeAddExercicePopup();
        };

        const openExercicePopup = (exercice) => {
            selectedExercice.value = exercice;
            showPopup.value = true;
        };

        const closePopup = () => {
            showPopup.value = false;
        };

        onMounted(() => {
            fetchTraining();
        });

        return { training, goBack, addExercise, showPopup, selectedExercice, openExercicePopup, closePopup, showAddExercicePopup, closeAddExercicePopup, handleExerciceAdded };
    },
};
</script>

<style scoped>
.header-container {
    text-align: center;
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.header-container h2 {
    margin: 0;
}

.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.popup-content {
    background: rgb(39, 39, 39);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 20px;
    border-radius: 15px;
    max-width: 800px;
    width: 90%;
}
</style>