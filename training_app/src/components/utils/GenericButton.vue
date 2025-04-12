<script setup lang="ts">
import type { PropType } from 'vue'
const props = defineProps({
  desktopText: { type: String, default: '' },
  mobileText: { type: String, default: '' },
  icon: { type: String, default: '' },
  color: { type: String, default: '#4caf50' },
  type: { type: String as PropType<'button' | 'submit' | 'reset'>, default: 'button' },
  textColor: { type: String, default: '#fff' },
  disabled: { type: Boolean, default: false }
})
const emit = defineEmits(['click'])
function handleClick(event: Event) {
  if (props.disabled) return
  emit('click', event)
}
</script>

<template>
  <button :type="type" :disabled="disabled" @click="handleClick" :style="{ backgroundColor: color, display: 'flex', alignItems: 'center' }">
    <span class="material-symbols-outlined" :style="{ color: textColor }">{{ icon }}</span>
    <span class="desktop-text" :style="{ color: textColor }">{{ desktopText }}</span>
    <span class="mobile-text" :style="{ color: textColor }">{{ mobileText }}</span>
  </button>
</template>

<style scoped>
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

button:hover:enabled {
  transform: scale(1.05);
}

button:active:enabled {
  transform: scale(0.95);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transition: none;
  transform: none;
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
</style>