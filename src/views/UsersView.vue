Esta sección permitirá gestionar los usuarios o clientes del sistema.

```vue
<template>
  <div class="view-container users-view">
    <h1>Gestión de Usuarios</h1>
    <p class="subtitle">Administra los permisos y la información de los usuarios del sistema.</p>

    <div class="toolbar">
      <input type="text" placeholder="Buscar por nombre o email..." class="search-input">
      <button class="btn-primary">➕ Añadir Nuevo Usuario</button>
    </div>

    <div class="user-list">
      <div class="user-row">
        <span class="user-name">Juan Pérez</span>
        <span class="user-role">Administrador</span>
        <div class="actions">
          <button class="btn-action">Editar</button>
          <button class="btn-action delete">Eliminar</button>
        </div>
      </div>
      <div class="user-row">
        <span class="user-name">María López</span>
        <span class="user-role">Editor</span>
        <div class="actions">
          <button class="btn-action">Editar</button>
          <button class="btn-action delete">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Lógica para cargar, buscar y manipular la lista de usuarios.
</script>

<style scoped>
.users-view {
  padding: 30px;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.search-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 300px;
}
.user-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}
.user-row:last-child {
  border-bottom: none;
}
.user-name {
  font-weight: bold;
  flex-grow: 1;
}
.user-role {
  background-color: #e0f7fa;
  color: #00bcd4;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8em;
  margin-right: 20px;
}
.btn-action {
  background: none;
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}
.btn-action.delete {
  color: #e74c3c;
  border-color: #e74c3c;
}
</style>