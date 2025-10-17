<template>
  <div class="vehicle-config-view">
    <div class="content-header">
      <h2>⚙️ Configuración de Ingresos de Vehículos</h2>
      <p>Administra las categorías de vehículos, sus iconos y la capacidad máxima (límite) permitida para cada tipo en el sistema de control de patio.</p>
    </div>

    <section class="config-panel">
      <h3>Límites de Capacidad y Categorías</h3>
      
      <div class="alert-info">
        <p>💡 **Próximo Paso:** Aquí se implementará la lógica para **visualizar, agregar, editar y eliminar** las categorías y sus límites (Ej: Volteo Directo: 2, Carritos: 8).</p>
      </div>
      
      <button class="btn-add">
        + Añadir Nueva Categoría
      </button>

      <div class="category-list">
        </div>
      
    </section>

  </div>
</template>

<script setup>
// Aquí podrías importar la lógica de gestión de estados si usas Pinia/Vuex
// o definir tus métodos para cargar y guardar la configuración.

// import { ref } from 'vue';
// const categories = ref([]); 
// const loadCategories = () => { /* Lógica para cargar desde API */ };
// loadCategories();
</script>

<style scoped>
.vehicle-config-view {
  padding: 30px;
}

.content-header {
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
  padding-bottom: 15px;
}

.content-header h2 {
  margin: 0 0 5px 0;
  color: #333;
}

.content-header p {
  color: #666;
  font-size: 1em;
}

.config-panel {
  background: #f7f9fc;
  border: 1px solid #e0e6ed;
  border-radius: 10px;
  padding: 25px;
}

h3 {
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  color: #2c3e50;
  font-size: 1.2em;
  margin-top: 0;
}

.alert-info {
  padding: 15px;
  background-color: #ecf0f1;
  border-left: 5px solid #3498db;
  margin-bottom: 20px;
  border-radius: 4px;
}
.alert-info p {
  margin: 0;
  color: #2c3e50;
  font-size: 0.95em;
}

.btn-add {
  background-color: #27ae60;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  transition: background-color 0.2s;
  margin-bottom: 20px;
}
.btn-add:hover {
  background-color: #2ecc71;
}
</style>