// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
// Importa tus componentes de página. Necesitas crear estos archivos después.
import Home from '../views/HomeView.vue';
import Reports from '../views/ReportsView.vue';
import Users from '../views/UsersView.vue';
import Settings from '../views/SettingsView.vue';

// 1. Define tus rutas
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/reportes',
    name: 'Reports',
    component: Reports
  },
  {
    path: '/usuarios',
    name: 'Users',
    component: Users
  },
  {
    path: '/configuracion',
    name: 'Settings',
    component: Settings
  }
];

// 2. Crea la instancia del router
const router = createRouter({
  history: createWebHistory(), // Usa el modo 'history' (URLs limpias sin #)
  routes, // Pasa el arreglo de rutas
});

export default router;