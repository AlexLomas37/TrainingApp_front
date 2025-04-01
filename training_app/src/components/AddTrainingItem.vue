<script setup lang="ts">
import { ref } from 'vue';
import GenericButton from '@/components/utils/GenericButton.vue';

const props = defineProps<{ disciplineId: number }>();
const emit = defineEmits(['close']);
const message = ref('');

function handleSubmit(e: Event) {
  e.preventDefault();
  const target = e.target as HTMLFormElement;
  const formData = new FormData(target);
  const trainingName = formData.get('trainingName');
  const trainingDescription = formData.get('trainingDescription');
  const trainingDuration = formData.get('trainingDuration');

  console.log(props.disciplineId);
  message.value = '';
  fetch('/api/trainings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: trainingName,
      description: trainingDescription,
      time: trainingDuration,
      discipline: {
        id: props.disciplineId
      }
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Échec de l\'ajout du training');
      }
      return response.json();
    })
    .then(data => {
      // Rafraîchit la page au lieu d’afficher un message et fermer la popup
      window.location.reload();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
</script>

<template>
  <card class="cardAddTraining">
    <div class="card-header">
      <h2>Ajouter un entrainement</h2>
    </div>
    <hr class="separator" />
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <label>Nom de l'entraînement</label>
        <input class="input" type="text" name="trainingName" placeholder="Nom de l'entraînement" required />
        <label>Description de l'entraînement</label>
        <textarea class="input" name="trainingDescription" placeholder="Description de l'entraînement"
          required></textarea>
        <label>Durée de l'entrainement (minutes)</label>
        <input class="input" type="number" name="trainingDuration" placeholder="Durée en minutes" required />
        <div v-if="message">
          <p>{{ message }}</p>
        </div>
        <div class="button-container">
          <GenericButton desktopText="Fermer" mobileText="Fermer" color="rgb(46, 46, 46)" type="button"
            @click="$emit('close')" />
          <GenericButton desktopText="Ajouter" mobileText="Ajouter" color="#08d" type="submit" />
        </div>
      </form>
    </div>
  </card>
</template>

<style scoped>
.cardAddTraining {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: rgb(39, 39, 39);
  width: 100%;
  max-width: 500px;
  margin: 0;
  text-align: center;
}

.cardAddTraining-header {
  position: relative;
  height: 150px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0 -16px 16px -16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.separator {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 8px 0;
  width: calc(100% + 32px);
  margin-left: -16px;
}

.input-container {
  height: 50px;
  position: relative;
  width: 100%;
}

.input {
  background-color: #3d3d3d;
  border-radius: 12px;
  border: 0;
  box-sizing: border-box;
  color: #eee;
  font-size: 18px;
  height: 100%;
  outline: 0;
  padding: 4px 20px 0;
  width: 100%;
  transition: all 0.3s ease;
  height: 50px;
  margin-bottom: 20px;
}

textarea.input {
  resize: vertical;
  overflow: auto;
  height: 150px;
}

.submit {
  background-color: #08d;
  border-radius: 12px;
  border: 0;
  box-sizing: border-box;
  color: #eee;
  cursor: pointer;
  font-size: 18px;
  height: 50px;
  margin-top: 38px;
  outline: 0;
  text-align: center;
  width: 100%;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.close {
  background-color: rgb(46, 46, 46);
  border-radius: 12px;
  border: 0;
  box-sizing: border-box;
  color: #eee;
  cursor: pointer;
  font-size: 18px;
  height: 50px;
  margin-top: 38px;
  outline: 0;
  text-align: center;
  width: 100%;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit:hover,
.close:hover {
  transform: scale(1.05);
}

.submit:active,
.close:active {
  transform: scale(0.95);
}

.button-container {
  display: flex;
  justify-content: space-between;
  gap: 50px;
}
</style>