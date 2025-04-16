<script setup lang="ts">
import GenericButton from '../components/utils/GenericButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function handleShowDisciplines() {
  router.push('/disciplines')
}
</script>

<template>
  <main>
    <h1>La seule application de gestion de vos entraînements !</h1>
    <GenericButton 
      desktopText="Afficher les disciplines" 
      mobileText="Disciplines" 
      icon="list" 
      @click="handleShowDisciplines" 
    />
  </main>
</template>
