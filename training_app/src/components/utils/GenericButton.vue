<script setup lang="ts">
defineProps({
  desktopText: { type: String, default: '' },
  mobileText: { type: String, default: '' },
  color: { type: String, default: '#4caf50' },
  type: { type: String, default: 'button' },
  textColor: { type: String, default: '#fff' } // nouveau prop pour la couleur du texte
});
const emit = defineEmits(['click']);

function handleClick(event: Event) {
  emit('click', event);
}
</script>

<template>
  <button :type="type" @click="handleClick" :style="{ backgroundColor: color }">
    <span class="desktop-text" :style="{ color: textColor }">{{ desktopText }}</span>
    <span class="mobile-text" :style="{ color: textColor }">{{ mobileText }}</span>
  </button>
</template>

<style scoped>
/* ...existing common styles... */
button {
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  height: 45px;
  padding: 0 20px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin: 10px;
}
button:hover {
  transform: scale(1.05);
}
button:active {
  transform: scale(0.95);
}
.desktop-text {
  display: inline;
}
.mobile-text {
  display: none;
}
@media (max-width: 600px) {
  .desktop-text { display: none; }
  .mobile-text { display: inline; }
}
</style>