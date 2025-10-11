<template>
  <aside class="sidebar" :class="{ 'collapsed': isCollapsed, 'is-open': isMenuOpen }">
    <nav class="sidebar-nav">
      
      <div class="sidebar-logo-area">
          <router-link to="/" class="logo-link">
              <span v-if="!isCollapsed" class="full-logo">
                  <span class="logo-icon">✨</span> 
                  **Dashboard**
              </span>
              <span v-else class="short-logo">✨</span>
          </router-link>
          
          <button class="toggle-btn" @click="toggleCollapse" :title="isCollapsed ? 'Expandir' : 'Colapsar'">
              <span class="hamburger-icon">☰</span>
          </button>
      </div>
      
      <button class="close-mobile" @click="toggleMobileMenu">✖️</button>

      <div class="nav-links-wrapper">
          <router-link 
              v-for="link in navLinks" 
              :key="link.path" 
              :to="link.path" 
              @click="closeMobileMenu"
              active-class="active-link"
              :title="link.name"
              class="menu-item"
          >
              <span class="link-icon">{{ link.icon }}</span>
              <span v-if="!isCollapsed" class="link-name">{{ link.name }}</span>
          </router-link>
      </div>

      <div class="sidebar-utility-area">
          <a href="#salir" class="btn-salir" :title="isCollapsed ? 'Salir' : 'Cerrar Sesión'">
              <span class="link-icon">🚪</span>
              <span v-if="!isCollapsed" class="link-name">Cerrar Sesión</span>
          </a>
          
          
      </div>
    </nav>
  </aside>
  
  <div v-if="isMenuOpen" class="sidebar-overlay" @click="toggleMobileMenu"></div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['toggle-collapse', 'toggle-mobile']);

// Estados de control
const isCollapsed = ref(false);
const isMenuOpen = ref(false);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  emit('toggle-collapse', isCollapsed.value);
};

const toggleMobileMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  emit('toggle-mobile', isMenuOpen.value);
};

const closeMobileMenu = () => {
  if (isMenuOpen.value) {
    isMenuOpen.value = false;
    emit('toggle-mobile', false);
  }
};

const navLinks = [
  { name: 'Inicio', path: '/', icon: '🏠' },
  { name: 'Reportes', path: '/reportes', icon: '📈' },
  { name: 'Usuarios', path: '/usuarios', icon: '👥' },
  { name: 'Configuración', path: '/configuracion', icon: '⚙️' },
];
</script>

<style scoped>
/* Variables de Diseño */
:root {
  --sidebar-width: 250px;
  --sidebar-width-collapsed: 60px; 
  --sidebar-bg: #dadade;
  --link-hover-bg: #2c3e50;
  --link-active-color: #4CAF50;
  --transition-duration: 0.3s;
  --sidebar-logo-height: 60px;
}

/* 1. Contenedor Principal del Sidebar */
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background-color: #a5d879;
  color: rgb(94, 246, 117);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 2px 0 5px #00000033;
  transition: width var(--transition-duration) ease, transform var(--transition-duration) ease;
}

.sidebar-nav {
    display: flex;
    flex-direction: column; /* ¡CLAVE! Estructura vertical completa del sidebar */
    height: 100%;
}

.sidebar.collapsed {
  width: var(--sidebar-width-collapsed);
}

/* 2. Área de Logo y Toggle */
.sidebar-logo-area {
  height: var(--sidebar-logo-height);
  display: flex;
  align-items: center;
  justify-content: space-between; 
  padding: 0 10px;
  background-color: #a5d879; 
  border-bottom: 2px solid rgba(255, 255, 255, 0.1); 
  position: relative;
}

.logo-link {
    /* Ocultar en colapso */
    transition: opacity var(--transition-duration);
}

.sidebar.collapsed .logo-link {
    opacity: 0;
    width: 0;
    pointer-events: none;
}

/* --- ÍCONO DE COLAPSO (HAMBURGUESA) --- */
.toggle-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgb(16, 15, 15);
  cursor: pointer;
  padding: 5px;
  z-index: 10;
}

.hamburger-icon {
    font-size: 1.5em; 
    line-height: 1;
}

/* 3. Enlaces Principales */
.nav-links-wrapper {
  flex-grow: 1; /* Ocupa el espacio central */
  overflow-y: auto;
  padding: 10px 0; 
  display: flex;
  flex-direction: column; /* ¡CLAVE! Enlaces verticales */
}

.menu-item {
  width: 100%; 
  display: flex; 
  align-items: center;
  padding: 12px 15px;
  color: rgb(26, 24, 24);
  text-decoration: none;
  transition: background-color var(--transition-duration) ease;
}

.link-icon {
  width: 30px; 
  font-size: 1.2em;
  text-align: center;
  margin-right: 10px; 
}

/* Estilos de colapso para los ítems */
.sidebar.collapsed .link-name {
    display: none;
}
.sidebar.collapsed .menu-item {
    justify-content: center; 
}

/* 4. Área de Utilidad (Footer del Sidebar) */
.sidebar-utility-area {
  padding: 10px 0;
  border-top: 2px solid rgba(255, 255, 255, 0.1); 
  background-color: #f0f0f0; 
  display: flex;
  flex-direction: column; /* Verticalidad del Footer */
  align-items: center;
}

.btn-salir {
  background-color: #e74c3c;
  width: 90%; 
  margin: 0 0 10px 0;
  border-radius: 5px;
  justify-content: center;
}

.sidebar.collapsed .btn-salir {
    width: auto; 
    padding: 12px;
    border-radius: 50%;
}

.sidebar.collapsed .btn-salir .link-name {
    display: none;
}

.footer-extra-icon {
    font-size: 1.5em;
    padding: 5px;
    color: #ccc;
    cursor: pointer;
}

/* 5. Estilos de Responsividad Móvil */
.close-mobile {
    display: none;
}

.sidebar-overlay {
    display: none; 
}

@media (max-width: 768px) {
    .toggle-btn {
        display: none; 
    }
    .sidebar {
        transform: translateX(-100%);
        width: 250px; 
    }
    .sidebar.is-open {
        transform: translateX(0);
        box-shadow: 5px 0 15px rgba(239, 237, 237, 0.4);
    }
    .close-mobile {
        display: block;
        margin-left: auto;
    }
    .sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(203, 132, 132, 0.5);
        z-index: 999;
        display: block;
    }
}
</style>