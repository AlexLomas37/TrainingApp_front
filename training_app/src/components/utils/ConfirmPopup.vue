<template>
    <div v-if="visible" class="confirm-popup-overlay">
        <div class="confirm-popup">
            <p>{{ message }}</p>
            <div class="buttons">
                <GenericButton @click="onConfirm" icon="check" desktopText="Oui" color="#4caf50" type="button" />
                <GenericButton @click="onCancel" icon="close" desktopText="Non" color="#f44336" type="button" />
            </div>
        </div>
    </div>
</template>

<script>
import GenericButton from '@/components/utils/GenericButton.vue';
export default {
    name: 'ConfirmPopup',
    components: {
        GenericButton
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            default: 'Êtes-vous sûr ?'
        },
        confirmFn: {
            type: Function,
            default: null
        }
    },
    methods: {
        onConfirm() {
            if (this.confirmFn) {
                this.confirmFn();
            }
            this.$emit('confirm');
        },
        onCancel() {
            this.$emit("update:visible", false);
            this.$emit('cancel');
        }
    }
};
</script>

<style scoped>
.confirm-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.confirm-popup {
    background: var(--color-background-soft);
    box-shadow: 0 4px 8px var(--color-border);
    padding: 20px;
    border-radius: 20px;
    text-align: center;
}

.buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    flex-direction: row;
    gap: 10px;
}

.buttons button {
    margin: 5px;
}
</style>