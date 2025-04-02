<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GenericButton from '@/components/utils/GenericButton.vue';
import CardItem from '@/components/utils/CardItem.vue';
import AddTrainingItem from '@/components/AddTrainingItem.vue';

const BASE_API_URL = import.meta.env.DEV ? '/api' : `${import.meta.env.VITE_API_URL}`;

export default {
    components: {
        GenericButton,
        CardItem,
        AddTrainingItem,
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const discipline = ref(null);
        const showPopup = ref(false);
        const editing = ref(false);

        const fetchDiscipline = async () => {
            const id = route.params.id;
            const apiUrl = `${BASE_API_URL}/disciplines/${id}`;
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération de la discipline');
                }
                discipline.value = await response.json();
                console.log('Discipline data:', discipline.value);
            } catch (error) {
                console.error('Error fetching discipline:', error);
            }
        };

        const saveDiscipline = async () => {
            const apiUrl = `${BASE_API_URL}/disciplines/${discipline.value.id}`;
            try {
                const response = await fetch(apiUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(discipline.value)
                });
                if (!response.ok) {
                    throw new Error('Erreur lors de la sauvegarde de la discipline');
                }
                discipline.value = await response.json();
                editing.value = false;
            } catch (error) {
                console.error('Error saving discipline:', error);
            }
        };

        const deleteDiscipline = async () => {
            if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette discipline ?')) return;
            const apiUrl = `${BASE_API_URL}/disciplines/${discipline.value.id}`;
            try {
                const response = await fetch(apiUrl, { method: 'DELETE' });
                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression de la discipline');
                }
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
            modifyDiscipline: () => (editing.value = true),
            saveDiscipline,
            deleteDiscipline,
            goToTraining
        };
    },
};
</script>

<template>
    <main>
        <div v-if="discipline">
            <!-- Remplacement de discipline-header par header-container -->
            <div class="header-container">
                <h1>{{ discipline.name }}</h1>
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
                <p>{{ discipline.description }}</p>
                <p>Nombre d'entraînements : {{ discipline.trainings ? discipline.trainings.length : 0 }}</p>
            </div>
            <!-- Remplacement du training-header par header-container -->
            <div class="header-container">
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
    </main>
</template>

<style scoped>
/* Styles pour popup */
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

.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
}

.header-container h2 {
    margin: 0;
    line-height: 45px;
}

.header-container button {
    margin-top: 0;
}

.desktop-text {
    display: inline;
}

.mobile-text {
    display: none;
}

@media (max-width: 600px) {
    .desktop-text {
        display: none;
    }

    .mobile-text {
        display: inline;
    }
}

.cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    width: 100%;
    justify-content: center; /* Centrage des cartes */
}

/* New styles for popup */
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

button {
    background-color: #4caf50;
    border-radius: 8px;
    border: 1px solid #388e3c;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    height: 45px;
    margin-top: 20px;
    outline: none;
    text-align: center;
    width: auto;
    padding: 0 20px;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
    background-color: #45a049;
    transform: scale(1.05);
}

button:active {
    background-color: #388e3c;
    transform: scale(0.95);
}

main h1 {
    margin-bottom: 10px;
}

main p {
    margin-bottom: 20px;
}
</style>
