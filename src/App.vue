<template>
  <div class="dashboard-layout">
    <Sidebar 
      @toggle-collapse="handleSidebarToggle"
      @toggle-mobile="handleMobileMenuToggle"
    />
    
    <header class="page-header fixed-top" 
      :class="{ 
          'main-shifted': !sidebarIsCollapsed,
          'main-shifted-collapsed': sidebarIsCollapsed
      }"
    >
        <button class="menu-mobile-toggle" @click="toggleMobileMenu">☰</button>
        <div class="header-content">
            <h2 class="page-title">{{ $route.name || 'Dashboard' }}</h2> 
            <div class="user-info">Hola, Admin</div>
        </div>
    </header>

    <div 
      class="main-content-wrapper" 
      :class="{ 'sidebar-collapsed': sidebarIsCollapsed }"
    >
      <main class="page-content">
        <router-view />
      </main>
    </div>

    <footer class="page-footer fixed-bottom"
      :class="{ 
          'main-shifted': !sidebarIsCollapsed,
          'main-shifted-collapsed': sidebarIsCollapsed
      }"
    >
        <p>&copy; 2025.Todos los derechos reservados.</p>
        <p>Versión 1.0</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from './components/Sidebar.vue'; 
import { useRoute } from 'vue-router'; 

const route = useRoute(); 
const sidebarIsCollapsed = ref(false);
const mobileMenuIsOpen = ref(false);

const handleSidebarToggle = (isCollapsedState) => {
  // Solo aplicamos el colapso en desktop
  if (window.innerWidth > 768) {
    sidebarIsCollapsed.value = isCollapsedState;
  }
};

const handleMobileMenuToggle = (isOpenState) => { mobileMenuIsOpen.value = isOpenState; };
const toggleMobileMenu = () => { mobileMenuIsOpen.value = !mobileMenuIsOpen.value; };
</script>

<style> 
/* Estilos Globales para el LAYOUT (Sin "scoped") */
:root {
  --sidebar-width: 250px;
  --sidebar-width-collapsed: 60px;
  --header-height: 60px;
  --footer-height: 40px;
  --bg-color: #f4f7f9;
  --transition-duration: 0.3s;
  --padding-horizontal: 20px; /* Padding base del header/footer */
}

body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-family: sans-serif;
    background-color: var(--bg-color);
}

/* El Layout Principal */
.dashboard-layout {
    min-height: 100vh;
}

/* --- ESTILOS DINÁMICOS DEL HEADER Y FOOTER (POSICIONAMIENTO) --- */

.page-header, .page-footer {
  position: fixed;
  left: 0;
  width: 100%; 
  z-index: 999; 
  display: flex;
  align-items: center;
  transition: padding-left var(--transition-duration) ease;
}

/* Header */
.page-header {
    top: 0;
    height: var(--header-height);
    background-color: rgb(241, 239, 239);
    box-shadow: 0 1px 5px rgba(230, 228, 228, 0.1);
}

/* Footer */
.page-footer {
    bottom: 0;
    height: var(--footer-height);
    background-color: #f5f5f6; 
    border-top: 1px solid #dcdcdc;
    font-size: 0.85em;
    color: #111111;
}

/* 1. ESTADO NORMAL (Sidebar Abierto) */
.page-header.main-shifted, .page-footer.main-shifted {
    /* El padding empieza DESPUÉS del sidebar abierto (250px) */
    padding-left: calc(var(--sidebar-width) + var(--padding-horizontal));
    padding-right: var(--padding-horizontal);
    /* Aseguramos que el contenido comience justo en el borde del sidebar */
}

/* 2. ESTADO COLAPSADO (Sidebar Cerrado) */
.page-header.main-shifted-collapsed, .page-footer.main-shifted-collapsed {
    /* El padding empieza DESPUÉS del sidebar colapsado (60px) */
    padding-left: calc(var(--sidebar-width-collapsed) + var(--padding-horizontal));
    padding-right: var(--padding-horizontal);
}


/* --- CONTENEDOR PRINCIPAL DE CONTENIDO (Main Content) --- */

.main-content-wrapper {
    /* Margen para el sidebar abierto por defecto */
    margin-left: var(--sidebar-width);
    
    /* Padding fijo para dejar espacio al Header y Footer fijos */
    padding-top: var(--header-height);
    padding-bottom: var(--footer-height);
    
    transition: margin-left var(--transition-duration) ease;
    min-height: 100vh;
}

/* Ajuste de margen para el sidebar colapsado */
.main-content-wrapper.sidebar-collapsed {
    margin-left: var(--sidebar-width-collapsed);
}

.page-content {
  padding: 20px;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
    width: 100%; /* Asegura que ocupe el espacio completo restante */
}

/* Asegurando que el título no sea cortado */
.page-title {
    margin: 0; /* Remueve márgenes innecesarios */
    font-size: 1.4em;
    color: #333;
}

.menu-mobile-toggle {
    display: none; 
    background: none;
    border: none;
    font-size: 1.8em;
    cursor: pointer;
    color: #f8f2f2;
    padding-right: 15px; 
}

/* === MEDIA QUERY PARA RESPONSIVIDAD === */
@media (max-width: 768px) {
    /* Header y Footer en móvil: Ocupan todo el ancho, sin padding de ajuste */
    .page-header.main-shifted, .page-footer.main-shifted,
    .page-header.main-shifted-collapsed, .page-footer.main-shifted-collapsed {
        padding-left: var(--padding-horizontal);
    }
    
    /* El contenido principal ocupa el 100% en móvil */
    .main-content-wrapper {
        margin-left: 0;
    }
    
    /* Mostramos el botón de hamburguesa en el header */
    .menu-mobile-toggle {
        display: block;
    }
}
</style>