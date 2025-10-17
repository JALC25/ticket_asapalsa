<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" @click.self="close">
      <div class="modal-card">
        <header class="modal-header">
          <slot name="header">Modal Header</slot>
          <button type="button" class="btn-close" @click="close">
            &times;
          </button>
        </header>

        <section class="modal-body">
          <slot name="body">Modal Body</slot>
        </section>
        
        <footer class="modal-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6); /* Fondo semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; /* Asegurar que esté encima de todo el dashboard */
}

.modal-card {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 500px; /* Ancho máximo moderno */
  transition: all 0.3s ease;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h3 {
    margin: 0;
    color: #34495e;
}

.btn-close {
  border: none;
  font-size: 1.5em;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  background: transparent;
  color: #7f8c8d;
}

.modal-body {
  padding: 20px;
  max-height: 70vh; /* Limita la altura para evitar desbordamiento */
  overflow-y: auto;
}

.modal-footer {
    padding: 15px 20px;
    border-top: 1px solid #eee;
}

/* Transiciones (Opcional pero recomendable) */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity .3s;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>