<template>
    <div class="container">
        <div v-if="training">
            <div class="header-flex">
                <div class="training-info">
                    <h1>{{ training.name }}</h1>
                    <p>{{ training.description }}</p>
                </div>
                <div class="calendar-container">
                    <calendar-heatmap dark-mode :values="parseTrainingStats(trainingStats)" :end-date="endDate" :round="3" :max="1" style="width: 500px;" />
                </div>
            </div>
            <div class="header-container">
                <h2>Liste des exercices</h2>
                <GenericButton icon="add" desktopText="Ajouter un exercice" color="#4caf50" type="button"
                    @click="addExercise" />
            </div>
            <div v-if="training.exercices && training.exercices.length">
                <TrainingItem v-for="(exercice, index) in training.exercices" :key="index" :exerciseName="exercice.name"
                    :time="exercice.time" :repetitions="exercice.repetitions" @click="openExercicePopup(exercice)" />
            </div>
            <div v-else>
                <p>Aucun exercice trouvé.</p>
            </div>
            <div style="display: flex; align-items: center;">
                <GenericButton icon="arrow_back" desktopText="Retour" mobileText="Retour" color="rgb(46, 46, 46)" type="button" @click="goBack" />
                <GenericButton icon="fitness_center" desktopText="S'entrainer sur cet exercice" mobileText="S'entrainer" type="button" />
            </div>
        </div>
        <div v-else>
            Chargement en cours...
        </div>

        <!-- Popup pour afficher ExerciceView -->
        <div v-if="showPopup" class="popup-overlay" @click.self="closePopup">
            <div class="popup-content">
                <ExerciceView 
                    :exercice="selectedExercice" 
                    :chartOptions="chartOptions" 
                    :chartSeries="chartSeries" 
                    @close="closePopup" 
                    style="width: 100%; height: 100%;" 
                />
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
import { CalendarHeatmap } from 'vue3-calendar-heatmap';
import 'vue3-calendar-heatmap/dist/style.css';

// Constante globale pour l'API
const BASE_API_URL = import.meta.env.DEV ? '/api' : `${import.meta.env.VITE_API_URL}`;

export default {
    components: {
        GenericButton,
        TrainingItem,
        ExerciceView,
        AddExerciceItem,
        CalendarHeatmap,
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const training = ref(null);
        const trainingStats = ref(null);
        const showPopup = ref(false);
        const selectedExercice = ref(null);
        const showAddExercicePopup = ref(false);
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        const chartSeries = ref([
            {
                name: 'Statistiques',
                data: [30, 40, 35, 60, 65, 50, 70],
            },
        ]);

        const chartOptions = ref({
            stroke: {
                curve: 'smooth',
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            },
        });

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

        const fetchTrainingStats = async () => {
            const id = route.params.id;
            const apiUrl = `${BASE_API_URL}/statistics/trainings/matrix?training=${id}&startDate=${startDate}&endDate=${endDate}`;
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Error fetching training stats');
                }
                const data = await response.json();
                console.log('Training stats data:', data);
                trainingStats.value = data;
                console.log('Parsed training stats:', parseTrainingStats(data));
            } catch (error) {
                console.error('Error fetching training stats:', error);
            }
        };

        const parseTrainingStats = (stats) => {
            if (!stats) return []; // Added null check
            // Transforme un objet du type { "2025-03-31": false } en tableau [{ date: '2025-03-31', count: 1 }]
            return Object.entries(stats).map(([date, value]) => ({
                date,
                count: value === false ? 0 : 1
            }));
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
            fetchTrainingStats();
        });

        return { training, trainingStats, goBack, addExercise, showPopup, selectedExercice, openExercicePopup, closePopup, showAddExercicePopup, closeAddExercicePopup, handleExerciceAdded, parseTrainingStats, endDate, chartOptions, chartSeries };
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

.container {
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    /* include padding in width calculation */
    padding: 0 20px;
    /* adjust horizontal padding as needed */
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

.header-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    /* center all content horizontally */
}

.training-info {
    margin-right: 20px;
    /* space between training info and calendar */
}

.calendar-container {
    flex: 1;
    display: flex;
    justify-content: right;
    align-items: center;
}
</style>