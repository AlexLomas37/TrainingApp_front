<template>
  <div v-if="visible" class="error-popup-overlay">
    <div class="error-popup">
      <p>{{ message }}</p>
      <div class="buttons">
        <GenericButton @click="closePopup" icon="check" desktopText="Ok" color="#f44336" type="button" />
      </div>
    </div>
  </div>
</template>

<script>
import GenericButton from '@/components/utils/GenericButton.vue';
export default {
  name: 'ErrorPopup',
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
      default: 'Une erreur est survenue.'
    }
  },
  methods: {
    closePopup() {
      this.$emit("update:visible", false);
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.error-popup-overlay {
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

.error-popup {
    background: var(--color-background-soft);
    box-shadow: 0 4px 8px var(--color-border);
    padding: 20px;
    border-radius: 20px;
    text-align: center;
}

p {
    color: red;
    font-size: 18px;
}

.buttons {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.buttons button {
    margin: 5px;
}
</style>
