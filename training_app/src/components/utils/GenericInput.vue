<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  modelValue: string | number;
  type?: string;
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue']);

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <input
    class="input"
    :type="type || 'text'"
    :placeholder="placeholder"
    :value="modelValue"
    @input="onInput"
  />
</template>

<style scoped>
.input {
  background-color: #3d3d3d;
  border-radius: 12px;
  border: 0;
  box-sizing: border-box;
  color: #eee;
  font-size: 18px;
  height: 50px;
  outline: 0;
  padding: 4px 20px;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}
</style>
