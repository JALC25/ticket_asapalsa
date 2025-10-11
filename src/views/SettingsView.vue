Esta página contendrá opciones para ajustar el comportamiento de la aplicación.

<template>
  <div class="view-container settings-view">
    <h1>Configuración del Sistema</h1>
    <p class="subtitle">Ajusta las preferencias de la cuenta, seguridad y apariencia de tu dashboard.</p>

    <div class="settings-group">
      <h2>Ajustes de Cuenta</h2>
      <div class="setting-item">
        <label>Cambiar Nombre de Dashboard:</label>
        <input type="text" value="Tu Dashboard Vue">
      </div>
      <div class="setting-item">
        <label>Notificaciones por Email:</label>
        <input type="checkbox" checked>
      </div>
      <button class="btn-primary save-btn">Guardar Cambios</button>
    </div>

    <div class="settings-group">
      <h2>Seguridad</h2>
      <div class="setting-item">
        <label>Cambiar Contraseña:</label>
        <button class="btn-action">Modificar</button>
      </div>
      <div class="setting-item">
        <label>Autenticación de Dos Factores:</label>
        <button class="btn-action">Activar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Lógica para manejar el estado de las configuraciones.
</script>

<style scoped>
.settings-view {
  padding: 30px;
}
.settings-group {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}
.settings-group h2 {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
  color: #1a2938;
}
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f9f9f9;
}
.setting-item label {
  font-weight: 500;
  color: #555;
}
.setting-item input[type="text"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 250px;
}
.save-btn {
  margin-top: 20px;
}
</style>

---