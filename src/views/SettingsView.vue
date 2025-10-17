<template>
  <div class="settings-view">
    
    <router-view />

    <div class="main-settings-panel" v-if="$route.path === '/configuracion'">
      <div class="content-header">
        <h2>Configuración General</h2>
        <p>Administra los ajustes de usuarios y la configuración de ingresos del sistema.</p>
      </div>

      <div class="settings-grid">
        
        <div 
          class="setting-card user-config" 
          @click="goTo('/configuracion/usuarios')"
        >
          <span class="setting-icon">👥</span>
          <div class="setting-content">
            <h4 class="setting-title">Gestión de Usuarios</h4>
            </div>
          <span class="arrow-indicator">→</span>
        </div>

        <div 
          class="setting-card vehicle-config" 
          @click="goTo('/configuracion/vehiculos')"
        >
          <span class="setting-icon">🚚</span>
          <div class="setting-content">
            <h4 class="setting-title">Configuración de Ingresos</h4>
            </div>
          <span class="arrow-indicator">→</span>
        </div>

        <div 
          class="setting-card report-config" 
          @click="goTo('/configuracion/reportes')" 
        >
          <span class="setting-icon">📊</span>
          <div class="setting-content">
            <h4 class="setting-title">Configuración de Reportes</h4>
            </div>
          <span class="arrow-indicator">→</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute(); 

const goTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
/* ========================================================== */
/* 🔥 CÓDIGO FINAL CON ALINEACIÓN IZQUIERDA GARANTIZADA 🔥   */
/* ========================================================== */

.settings-view {
  padding: 30px;
  width: 100%; 
  box-sizing: border-box;
}

.main-settings-panel {
    width: 100%; 
}

/* --- ENCABEZADO CENTRADO --- */
.content-header {
  text-align: center; 
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

/* --- CSS GRID: CLAVE para forzar 3 columnas de igual ancho (FILAS) --- */
.settings-grid { 
  display: grid !important; 
  grid-template-columns: 1fr 1fr 1fr !important; 
  gap: 20px; 
  width: 100% !important; 
}

.setting-card {
  /* 🔑 PADDING SOLICITADO: 15px arriba/abajo, 180px izquierda/derecha */
  padding: 15px 10px !important; 
  
  border: none; 
  border-radius: 8px; 
  color: white; 
  
  display: flex; 
  flex-direction: row !important; 
  align-items: center !important; 
  
  /* 🔑 CLAVE: Contenido (ícono+texto) a la IZQUIERDA, Flecha a la DERECHA */
  justify-content: space-between !important; 
  
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  position: relative; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); 
}

/* --- ÍCONO: Grande y a la izquierda --- */
.setting-icon {
  font-size: 2.5em; 
  /* 🔑 CLAVE: Margen cero para que se pegue al borde del padding */
  margin-right: 0px !important; 
  color: white; 
  flex-shrink: 0; 
}

/* --- CONTENIDO DE TEXTO (Título y Descripción) --- */
.setting-content {
    display: flex;
    flex-direction: column; 
    flex-grow: 1; 
    
    /* 🔑 CLAVE: El texto debe iniciar a la izquierda */
    text-align: left !important; 
    
    /* Pequeño margen entre el ícono y el texto */
    margin-left: 10px; 
}

.setting-title {
  margin: 0; 
  font-size: 1.1em; 
  font-weight: 700;
  color: white; 
  text-align: left !important; /* Aseguramos la alineación izquierda */
  
  /* 🔑 CLAVE: Forzar a que el texto no se rompa o se centre por falta de espacio */
  white-space: nowrap; 
}

.setting-description {
  /* Esta parte está oculta, pero mantiene la alineación */
  color: #ecf0f1; 
  font-size: 0.8em; 
  margin: 0;
  text-align: left !important; 
  display: none; 
}

/* La flecha de navegación (derecha) */
.arrow-indicator {
  margin-left: 10px;
  font-size: 1.4em;
  color: white; 
  opacity: 0.7;
  position: static; 
  transform: none; 
  top: auto; 
  right: auto;
  flex-shrink: 0;
}

.setting-card:hover .arrow-indicator {
  opacity: 1;
}

/* EFECTOS HOVER */
.setting-card:hover { 
  transform: translateY(-3px); 
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); 
  opacity: 0.95; 
}

/* --- COLORES DE FONDO POR TIPO DE TARJETA --- */

.user-config { 
    background-color: #9b59b6 !important; 
}

.vehicle-config { 
    background-color: #e74c3c !important; 
}

.report-config { 
    background-color: #3498db !important; 
}

/* Media Query de seguridad: Si el espacio es muy reducido (ej. móvil), vuelve a una columna */
@media (max-width: 900px) {
    .settings-grid {
        grid-template-columns: 1fr !important;
    }
}
</style>