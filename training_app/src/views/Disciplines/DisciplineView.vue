<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GenericButton from '@/components/utils/GenericButton.vue';
import CardItem from '@/components/utils/CardItem.vue';
import AddTrainingItem from '@/components/AddTrainingItem.vue';
import GenericInput from '@/components/utils/GenericInput.vue';
import GenericTextArea from '@/components/utils/GenericTextArea.vue';
import EditButtons from '@/components/utils/EditButtons.vue';
import ConfirmPopup from '@/components/utils/ConfirmPopup.vue';
import ErrorPopup from '@/components/utils/ErrorPopup.vue';
import type { Discipline } from '@/models/Discipline';
import type { Training } from '@/models/Training';

const BASE_API_URL = import.meta.env.DEV ? '/api' : `${import.meta.env.VITE_API_URL}`;

const route = useRoute();
const router = useRouter();
const discipline = ref<Discipline>();
const originalDiscipline = ref<Discipline>();
const showPopup = ref(false);
const editing = ref(false);
const showDeletePopup = ref(false);
const errorPopupVisible = ref(false);
const errorPopupMessage = ref('');

async function fetchDiscipline() {
    const id = route.params.id;
    const apiUrl = `${BASE_API_URL}/disciplines/${id}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de la discipline.');
        }
        const data = await response.json();
        discipline.value = data;
        originalDiscipline.value = JSON.parse(JSON.stringify(data));
        console.log('Discipline data:', discipline.value);
    } catch (error) {
        console.error('Error fetching discipline:', error);
        errorPopupMessage.value = "Erreur lors de la récupération de la discipline.";
        errorPopupVisible.value = true;
    }
};

async function saveDiscipline() {
    const apiUrl = `${BASE_API_URL}/disciplines/${discipline.value!.id}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: discipline.value!.name,
                description: discipline.value!.description
            })
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la sauvegarde de la discipline');
        }
        discipline.value = await response.json();
        editing.value = false;
    } catch (error) {
        console.error('Error saving discipline:', error);
        errorPopupMessage.value = "Erreur lors de la sauvegarde de la discipline";
        errorPopupVisible.value = true;
    }
};

function cancelEdit() {
    discipline.value = JSON.parse(JSON.stringify(originalDiscipline.value));
    editing.value = false;
};

function openDeletePopup() {
    showDeletePopup.value = true;
}

function closeDeletePopup() {
    showDeletePopup.value = false;
}

function modifyDiscipline() {
    editing.value = true;
}

async function confirmDelete() {
    closeDeletePopup();
    const apiUrl = `${BASE_API_URL}/disciplines/${discipline.value!.id}`;
    try {
        const response = await fetch(apiUrl, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de la discipline');
        }
        router.push('/disciplines');
    } catch (error) {
        console.error('Error deleting discipline:', error);
        errorPopupMessage.value = "Erreur lors de la suppression de la discipline";
        errorPopupVisible.value = true;
    }
}

function goToTraining(training: Training) {
    router.push(`/training/${training.id}`);
}

onMounted(() => {
    fetchDiscipline();
});
</script>

<template>
    <main>
        <div v-if="discipline" class="discipline-container">
            <div v-if="editing">
                <div class="header-container">
                    <GenericInput v-model="discipline.name" label="Nom de la discipline" />
                    <EditButtons :onSave="saveDiscipline" :onCancel="cancelEdit" :onDelete="openDeletePopup" />
                </div>
                <GenericTextArea v-model="discipline.description" label="Description" type="textarea" />
            </div>
            <div v-else>
                <div class="header-container">
                    <h1>{{ discipline.name }}</h1>
                    <GenericButton icon="edit" desktopText="Modifier" color="#2196f3" type="button"
                        @click="modifyDiscipline" />
                </div>
                <p>{{ discipline.description }}</p>
                <p>Nombre d'entraînements : {{ discipline.trainings ? discipline.trainings.length : 0 }}</p>
            </div>
            <div class="header-container">
                <h2>Liste des entraînements associés à cette discipline :</h2>
                <GenericButton icon="add" desktopText="Ajouter un entraînement" color="#4caf50" type="button"
                    @click="showPopup = true" />
            </div>
            <div v-if="discipline.trainings && discipline.trainings.length" class="cards-container">
                <CardItem v-for="(training, index) in discipline.trainings" :key="index"
                    :customLogo="training.imageLink" @click="() => goToTraining(training)">
                    <template #header>
                        <img :src="training.imageLink" alt="Logo" class="logo_front" />
                        <h2>{{ training.name }}</h2>
                    </template>
                    <template #body>
                        <p style="display: flex; align-items: center;">
                            <span class="material-symbols-outlined" style="margin-right: 0.5rem;">timer</span> {{
                                training.time }} min
                        </p>
                        <p>{{ training.description }}</p>
                    </template>
                </CardItem>
            </div>
            <div v-else>
                <p>Aucun entraînement pour cette discipline.</p>
            </div>
            <ConfirmPopup :visible="showDeletePopup" message="Êtes-vous sûr de vouloir supprimer cette discipline ?"
                :confirmFn="confirmDelete" @update:visible="(val: boolean) => showDeletePopup = val" />
            <ErrorPopup :visible="errorPopupVisible" :message="errorPopupMessage" @update:visible="(val: boolean) => errorPopupVisible = val" />
        </div>
        <div v-else>
            Chargement...
        </div>
        <div v-if="showPopup" class="popup-overlay">
            <div class="popup-content">
                <AddTrainingItem :disciplineId="discipline!.id" @close="showPopup = false" />
            </div>
        </div>
        <GenericButton icon="arrow_back" desktopText="Retour" color="rgb(46, 46, 46)" type="button"
            @click="$router.push('/disciplines')" />
    </main>
</template>

<style scoped>
.discipline-container {
    width: 100%;
}

/* Styles pour popup */
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
}

.popup-content {
    box-shadow: 0 4px 8px var(--color-border);
    border-radius: 15px;
    max-width: 800px;
}

main {
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
    padding: 0 20px;
    /* Optional: Add some padding for content alignment */
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

.logo_front {
    width: 100px;
    height: auto;
    border-radius: 15px;
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
    justify-content: flex-start;
    /* Align cards to the start */
    padding: 0 20px;
    /* Optional: Add padding for alignment */
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
    display: flex;
    justify-content: center;
    align-items: center;
}

main h1 {
    margin-bottom: 10px;
}

main p {
    margin-bottom: 20px;
}
</style>
