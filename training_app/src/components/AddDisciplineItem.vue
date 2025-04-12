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
          <GenericButton icon="add" desktopText="Ajouter" color="#4caf50" type="submit" />
        </div>
      </form>
    </div>
  </card>
</template>

<style scoped>
.cardAddDiscipline {
  border: 1px solid var(--v-border-color);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: var(--color-background);
  color: var(--v-text-primary);
  width: 100%;
  max-width: 500px;
  margin: 0;
  text-align: center;
}
.separator {
  border: none;
  border-top: 1px solid var(--color-border);

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
  border-radius: 12px;
  border: 0;
  box-sizing: border-box;
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
  height: 200px;
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