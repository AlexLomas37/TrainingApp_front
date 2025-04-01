<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import CardItem from '@/components/utils/CardItem.vue';
import GenericButton from '@/components/utils/GenericButton.vue';
import AddTrainingItem from '@/components/AddTrainingItem.vue';

export default {
    components: {
        CardItem,
        GenericButton,
        AddTrainingItem
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const discipline = ref(null);
        const showPopup = ref(false);
        const editing = ref(false);

        const fetchDiscipline = async () => {
            try {
                const id = route.params.id;
                const response = await axios.get(`/api/disciplines/${id}`);
                discipline.value = response.data;
            } catch (error) {
                console.error('Error fetching discipline:', error);
            }
        };

        const modifyDiscipline = () => {
            editing.value = true;
        };

        const saveDiscipline = async () => {
            try {
                const response = await axios.put(`/api/disciplines/${discipline.value.id}`, discipline.value);
                discipline.value = response.data;
                editing.value = false;
            } catch (error) {
                console.error('Error saving discipline:', error);
            }
        };

        const deleteDiscipline = async () => {
            if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette discipline ?')) return;
            try {
                await axios.delete(`/api/disciplines/${discipline.value.id}`);
                router.push('/disciplines');
            } catch (error) {
                console.error('Error deleting discipline:', error);
            }
        };

        const goToTraining = (training) => {
            router.push(`/training/${training.id}`);
        };

        onMounted(() => {
            fetchDiscipline();
        });

        return {
            discipline,
            showPopup,
            editing,
            modifyDiscipline,
            saveDiscipline,
            deleteDiscipline,
            goToTraining
        };
    },
};
</script>

<template>
    <div class="container">
        <div v-if="discipline">
            <!-- Conteneur header modifié -->
            <div class="discipline-header">
                <h1>Discipline</h1>
                <GenericButton v-if="!editing" desktopText="Modifier" mobileText="M" color="#2196f3" type="button"
                    @click="modifyDiscipline" />
            </div>
            <div v-if="editing">
                <!-- Champs éditables en mode édition -->
                <input type="text" v-model="discipline.name" />
                <textarea v-model="discipline.description"></textarea>
                <div class="buttons">
                    <GenericButton desktopText="Sauvegarder" mobileText="S" color="#2196f3" type="button"
                        @click="saveDiscipline" />
                    <GenericButton desktopText="Supprimer" mobileText="Suppr" color="#f44336" type="button"
                        @click="deleteDiscipline" />
                </div>
            </div>
            <div v-else>
                <!-- Affichage statique -->
                <p>{{ discipline.name }}</p>
                <p>{{ discipline.description }}</p>
            </div>
            <div class="training-header">
                <h2>Liste des entraînements associés à cette discipline :</h2>
                <GenericButton desktopText="Ajouter un entraînement" mobileText="+" color="#4caf50" type="button"
                    @click="showPopup = true" />
            </div>
            <div v-if="discipline.trainings && discipline.trainings.length" class="cards-container">
                <CardItem v-for="(training, index) in discipline.trainings" :key="index"
                    @click="() => goToTraining(training)">
                    <template #header>
                        <h2>{{ training.name }}</h2>
                    </template>
                    <template #body>
                        <p>{{ training.description }}</p>
                        <p>Durée : {{ training.time }} min</p>
                    </template>
                </CardItem>
            </div>
            <div v-else>
                <p>Aucun entraînement pour cette discipline.</p>
            </div>
        </div>
        <div v-else>
            Chargement...
        </div>
        <!-- Popup overlay pour ajouter un entraînement -->
        <div v-if="showPopup" class="popup-overlay">
            <div class="popup-content">
                <AddTrainingItem :disciplineId="discipline.id" @close="showPopup = false" />
            </div>
        </div>
        <GenericButton desktopText="Retour" mobileText="Retour" color="#4caf50" type="button"
            @click="$router.push('/disciplines')" />
    </div>
</template>

<style scoped>
/* Ajout des styles pour popup */
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup-content {
    display: flex;
    justify-content: center;
    align-items: center;
}

.discipline-header {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.training-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    width: 100%;
    justify-content: space-evenly;
    align-self: center;
}

.buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100vw;
}
</style>
