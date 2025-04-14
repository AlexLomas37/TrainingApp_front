<template>
    <div class="container">
        <div v-if="training">
            <div class="header-flex">
                <div class="training-info">
                    <div class="title-container">
                        <h1>{{ training.name }}</h1>
                        <template v-if="isEditMode">
                            <EditButtons :onSave="saveChanges" :onCancel="cancelChanges" :onDelete="openDeletePopup" />
                        </template>
                        <template v-else>
                            <GenericButton icon="edit" desktopText="Modifier" color="#4caf50" type="button"
                                @click="toggleEditMode" />
                        </template>
                    </div>
                    <p>{{ training.description }}</p>
                </div>
                <div class="calendar-container">
                    <div style="display: flex; flex-direction: column;">
                        <h2>Vos derniers entrainements</h2>
                        <calendar-heatmap dark-mode :values="adaptTrainingStatsHeatMap(trainingStats)" :end-date="endDate" :round="3" :max="1" class="heatmap" />
                    </div>
                </div>
            </div>
            <div class="header-container">
                <h2>Liste des exercices</h2>
                <GenericButton icon="add" desktopText="Ajouter un exercice" color="#4caf50" type="button"
                    @click="addExercise" />
            </div>
            <div v-if="training.exercices && training.exercices.length" class="cards-container">
                <ExerciceItem v-for="(exercice, index) in training.exercices" :key="index" :exerciseName="exercice.name"
                    :time="exercice.time" :repetitions="exercice.repetitions" :editMode="isEditMode"
                    @click="openExercicePopup(exercice)" />
            </div>
            <div v-else>
                <p>Aucun exercice trouvé.</p>
            </div>
            <div style="display: flex; align-items: center;">
                <GenericButton icon="arrow_back" desktopText="Retour" mobileText="Retour" color="rgb(46, 46, 46)"
                    type="button" @click="goBack" />
                <GenericButton icon="play_arrow" desktopText="Lancer l'entrainement" mobileText="S'entrainer"
                    type="button" @click="launchTraining" />
            </div>
        </div>
        <div v-else>
            Chargement en cours...
        </div>

        <!-- Popup pour afficher ExerciceView -->
        <div v-if="showPopup" class="popup-overlay" @click.self="closePopup">
            <div class="popup-content">
                <ExerciceView :exercice="selectedExercice"
                    @close="closePopup" style="width: 100%; height: 100%;" />
            </div>
        </div>

        <!-- Popup pour l'ajout d'un exercice -->
        <div v-if="showAddExercicePopup" class="popup-overlay" @click.self="closeAddExercicePopup">
            <div class="popup-content">
                <AddExerciceItem :trainingId="training.id" @exercice-added="handleExerciceAdded"
                    @close="closeAddExercicePopup" />
            </div>
        </div>

        <!-- Popup pour la suppression de l'entraînement -->
        <div v-if="showDeletePopup" class="popup-overlay" @click.self="closeDeletePopup">
            <div class="popup-content">
                <p>Êtes-vous sûr de vouloir supprimer cet entraînement ?</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <GenericButton icon="check" desktopText="Oui" color="#4caf50" type="button"
                        @click="confirmDelete" />
                    <GenericButton icon="close" desktopText="Non" color="#f44336" type="button"
                        @click="closeDeletePopup" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GenericButton from '@/components/utils/GenericButton.vue';
import ExerciceItem from '@/components/ExerciceItem.vue';
import ExerciceView from '@/views/ExerciceView.vue';
import AddExerciceItem from '@/components/AddExerciceItem.vue';
import { CalendarHeatmap } from 'vue3-calendar-heatmap';
import EditButtons from '@/components/utils/EditButtons.vue';
import { adaptTrainingStatsHeatMap } from '@/util/adapter/AdapterStats';
import 'vue3-calendar-heatmap/dist/style.css';

// Constante globale pour l'API
const BASE_API_URL = import.meta.env.DEV ? '/api' : `${import.meta.env.VITE_API_URL}`;

export default {
    components: {
        GenericButton,
        ExerciceItem,
        ExerciceView,
        AddExerciceItem,
        CalendarHeatmap,
        EditButtons,
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const training = ref(null);
        const trainingStats = ref(null);
        const showPopup = ref(false);
        const selectedExercice = ref(null);
        const showAddExercicePopup = ref(false);
        const showDeletePopup = ref(false);
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        const isEditMode = ref(false);

        const toggleEditMode = () => {
            isEditMode.value = !isEditMode.value;
        };

        const saveChanges = () => {
            console.log('Changes saved');
            isEditMode.value = false;
        };

        const cancelChanges = () => {
            console.log('Changes canceled');
            isEditMode.value = false;
        };

        const openDeletePopup = () => {
            showDeletePopup.value = true;
        };

        const closeDeletePopup = () => {
            showDeletePopup.value = false;
        };

        const confirmDelete = async () => {
            closeDeletePopup();
            const id = route.params.id;
            const apiUrl = `${BASE_API_URL}/trainings/${id}`;
            try {
                const response = await fetch(apiUrl, { method: 'DELETE' });
                if (!response.ok) {
                    throw new Error('Error deleting training');
                }
                router.back();
            } catch (error) {
                console.error('Error deleting training:', error);
            }
        };

        const launchTraining = async () => {
            const trainingSession = await createTrainingSession(training.value.id);
            if (!trainingSession) {
                console.error('Failed to create training session');
                return;
            }
            router.push({ name: 'trainingSession', params: { id: trainingSession.id } });
            console.log('Training launched');
        };

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
            const apiUrl = `${BASE_API_URL}/statistics/trainings/heatmap?training=${id}&startDate=${startDate}&endDate=${endDate}`;
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

        const createTrainingSession = async (idTraining) => {
            const trainingSession = {
                start: new Date().toISOString(),
                end: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
                training: {
                    id: idTraining
                }
            };
            const apiUrl = `${BASE_API_URL}/training-sessions`;
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(trainingSession)
                });
                if (!response.ok) {
                    throw new Error('Error creating training session');
                }
                const data = await response.json();
                console.log('Training session created:', data);
                return data;
            } catch (error) {
                console.error('Error creating training session:', error);
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
            fetchTrainingStats();
        });

        return { training, trainingStats, adaptTrainingStatsHeatMap, goBack, addExercise, showPopup, selectedExercice, openExercicePopup, closePopup, showAddExercicePopup, closeAddExercicePopup, handleExerciceAdded, endDate, isEditMode, toggleEditMode, saveChanges, cancelChanges, showDeletePopup, openDeletePopup, closeDeletePopup, confirmDelete, launchTraining };
    },
};
</script>

<style scoped>
.title-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.header-container {
    text-align: center;
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.container {
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 20px;
    overflow-x: visible;
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

.header-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
}

.training-info {
    margin-right: 20px;
    flex: 1 1 auto;
}

.calendar-container {
    flex: 1 1 auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
}

.heatmap {
    width: 500px;
}

@media (max-width: 768px) {
    .heatmap {
        width: 100%;
    }
}

@media (max-width: 768px) {
    .calendar-container {
        flex: 1 1 100%;
        justify-content: center;
        margin-top: 20px;
    }
}
</style>