<template>
    <div style="display: flex; gap: 1rem;">
        <GenericButton icon="save" color="#4caf50" type="button"
            @click="onSave && onSave()" />
        <GenericButton icon="cancel" color="rgb(46, 46, 46)" type="button"
            @click="onCancel && onCancel()" />
        <GenericButton icon="delete" color="red" type="button"
            @click="onDelete && onDelete()" />
    </div>
</template>

<script setup lang="ts">
import GenericButton from '@/components/utils/GenericButton.vue';

const props = defineProps({
    onSave: { type: Function, default: null },
    onCancel: { type: Function, default: null },
    onDelete: { type: Function, default: null }
});
</script>