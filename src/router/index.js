// src/router/index.js (Configuración actual y correcta)

import { createRouter, createWebHistory } from 'vue-router';
// Importa tus componentes de página.
import Home from '../views/HomeView.vue';
import Reports from '../views/ReportsView.vue';
import Users from '../views/UsersView.vue';
import Settings from '../views/SettingsView.vue';
import VehicleConfig from '../views/VehicleConfigView.vue'; 
import LoginView from '../views/LoginView.vue'; 

// 1. Define tus rutas
const routes = [
  
  // 🔑 1. RUTA DE LOGIN (PUNTO DE ENTRADA)
  {
    path: '/login',
    name: 'Login',
    component: LoginView 
  },

  // 🔄 2. RUTA DE REDIRECCIÓN (La URL raíz te lleva a login)
  {
    path: '/',
    redirect: '/login' // 👈 Esto asegura que la primera pantalla sea el login
  },
  
  // 🏠 3. RUTAS PROTEGIDAS (DASHBOARD)
  {
    path: '/home',
    name: 'Home',
    component: Home // 👈 LoginView te llevará aquí: router.push('/home')
  },
  {
    path: '/reportes',
    name: 'Reports',
    component: Reports
  },
  
  // ⚙️ RUTA DE CONFIGURACIÓN CON RUTAS HIJAS
  {
    path: '/configuracion',
    name: 'Settings',
    component: Settings, 
    children: [
      {
        path: 'usuarios',
        name: 'UserConfig',
        component: Users 
      },
      {
        path: 'vehiculos',
        name: 'VehicleConfig',
        component: VehicleConfig 
      }
    ]
  },
];

// 2. Crea la instancia del router
const router = createRouter({
  history: createWebHistory(), 
  routes, 
});

export default router;