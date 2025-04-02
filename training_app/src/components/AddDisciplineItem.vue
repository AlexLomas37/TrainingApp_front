<script setup lang="ts">
import { ref } from 'vue';
import GenericButton from '@/components/utils/GenericButton.vue';
import GenericInput from '@/components/utils/GenericInput.vue';
import GenericTextArea from '@/components/utils/GenericTextArea.vue'

// Déclaration globale de BASE_API_URL
const BASE_API_URL = import.meta.env.DEV ? '/api' : `${import.meta.env.VITE_API_URL}`;

const emit = defineEmits(['close']);
const message = ref('');

// new reactive variables
const disciplineName = ref('');
const disciplineDescription = ref('');

function handleSubmit(e: Event) {
  e.preventDefault();
  message.value = '';
  const apiUrl = `${BASE_API_URL}/disciplines`;
  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: disciplineName.value,
      description: disciplineDescription.value,
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add discipline');
      }
      return response.json();
    })
    .then(data => {
      window.location.reload();
    })
    .catch(error => {
      console.error('Error:', error);
    })
}
</script>

<template>
  <card class="cardAddDiscipline">
    <div class="card-header">
      <h2>Ajouter une discipline</h2>
    </div>
    <hr class="separator" />
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <label>Nom de la discipline</label>
        <GenericInput v-model="disciplineName" type="text" placeholder="Nom de la discipline" required />
        <label>Description de la discipline</label>
        <GenericTextArea v-model="disciplineDescription" placeholder="Description de la discipline" required class="vertical-only" />
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
.cardAddDiscipline {
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

.cardAddDiscipline-header {
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

.form {
  background-color: #15172b;
  border-radius: 20px;
  box-sizing: border-box;
  height: 500px;
  padding: 20px;
  width: 320px;
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

.vertical-only {
  resize: vertical !important;
}
</style>