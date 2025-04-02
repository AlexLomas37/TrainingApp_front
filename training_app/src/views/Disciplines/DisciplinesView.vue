<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Discipline {
  id: number
  name: string
  description: string
  // ...other fields if any...
}

import CardItem from '@/components/utils/CardItem.vue'
import AddDisciplineItem from '@/components/AddDisciplineItem.vue'
import GenericButton from '@/components/utils/GenericButton.vue'

// Change ref type to Discipline[]
const apiData = ref<Discipline[]>([])
const error = ref(null)
const loading = ref(true)
const showPopup = ref(false)

// Nouvelle fonction pour récupérer les disciplines
async function fetchDisciplines() {
    loading.value = true
    try {
        // Utilise l'URL de l'API depuis la variable d'environnement si définie
        const apiUrl = import.meta.env.VITE_API_URL 
            ? `${import.meta.env.VITE_API_URL}/disciplines`
            : '/api/disciplines'
        const response = await fetch(apiUrl)
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données')
        }
        apiData.value = await response.json()
    } catch (err: any) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}

// Mise à jour du gestionnaire pour utiliser la réactivité immuable
function handleDisciplineAdded(newDiscipline: Discipline) {
    showPopup.value = false
    console.log("Nouvelle discipline reçue:", newDiscipline)  // pour debug
    apiData.value = [...apiData.value, newDiscipline]
}

onMounted(() => {
    fetchDisciplines()
})
</script>

<template>
    <main>
        <h1>Gestion des disciplines</h1>
        <p>Cette page rassemble toutes nos disciplines</p>
        <div class="header-container">
            <h2>Vos disciplines</h2>
            <GenericButton 
              desktopText="Ajouter une discipline" 
              mobileText="+" 
              color="#4caf50" 
              type="button" 
              @click="showPopup = true" />
        </div>

        <!-- Popup overlay -->
        <div v-if="showPopup" class="popup-overlay">
            <div class="popup-content">
                <!-- Ajout de l'écouteur avec passage d'argument -->
                <AddDisciplineItem @close="showPopup = false" @discipline-added="handleDisciplineAdded" />
            </div>
        </div>

        <div class="cards-container">
            <template v-if="loading">
                <p>Chargement des disciplines...</p>
            </template>
            <template v-else-if="error">
                <p>Erreur : {{ error }}</p>
            </template>
            <template v-else>
                <template v-if="apiData.length === 0">
                    <p>Aucune discipline disponible pour le moment.</p>
                </template>
                <CardItem 
                    v-for="(discipline, index) in apiData" 
                    :key="index" 
                    :redirectLink="`/discipline/${discipline.id}`">
                    <template #header>
                        <h3>{{ discipline.name }}</h3>
                    </template>
                    <template #body>
                        <p>{{ discipline.description }}</p>
                    </template>
                </CardItem>
            </template>
        </div>
    </main>
</template>

<style scoped>
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
