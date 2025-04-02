<template>
  <textarea
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :placeholder="placeholder"
    :rows="rows"
    :cols="cols"
    :style="computedStyle"
    class="generic-textarea"
    v-bind="$attrs"
  ></textarea>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  rows?: number;
  cols?: number;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  backgroundColor?: string;
}>();
defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const computedStyle = computed(() => ({
  minWidth: props.minWidth || 'auto',
  maxWidth: props.maxWidth || '100%',
  minHeight: props.minHeight || 'unset',
  maxHeight: props.maxHeight || 'unset',
  backgroundColor: props.backgroundColor || 'inherit',
}));
</script>

<style scoped>
.generic-textarea {
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;
}
</style>
