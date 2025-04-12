<template>
    <div style="display: flex; gap: 1rem;">
        <GenericButton icon="skip_previous" :disabled="disabledPrevious" color="rgb(46, 46, 46)" type="button"
            @click="onPrevious && onPrevious()" />
        <GenericButton v-if="!isPlaying" icon="play_arrow" :disabled="disabledPlay" color="#4caf50" type="button"
            @click="onPlay && onPlay()" />
        <GenericButton v-else icon="pause" :disabled="disabledPause" color="#4caf50" type="button"
            @click="onPause && onPause()" />
        <GenericButton icon="skip_next" :disabled="disabledNext" color="rgb(46, 46, 46)" type="button"
            @click="onNext && onNext()" />
        <GenericButton icon="stop" :disabled="disabledStop" color="red" type="button"
            @click="onStop && onStop()" />
    </div>
</template>

<script setup lang="ts">
import GenericButton from '@/components/utils/GenericButton.vue';

const props = defineProps({
    isPlaying: { type: Boolean, default: false },
    onPlay: { type: Function, default: null },
    onPause: { type: Function, default: null },
    onStop: { type: Function, default: null },
    onNext: { type: Function, default: null },
    onPrevious: { type: Function, default: null },
    disabledPrevious: { type: Boolean, default: false },
    disabledPlay: { type: Boolean, default: false },
    disabledPause: { type: Boolean, default: false },
    disabledNext: { type: Boolean, default: false },
    disabledStop: { type: Boolean, default: false },
});
</script>