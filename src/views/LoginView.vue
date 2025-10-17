<template>
  <div class="login-container">
    <div class="login-card">
      
      <div class="header">
        <span class="icon">🔒</span>
        <h1>Bienvenido</h1>
        <p>Ingresa tus credenciales para acceder al Sistema.</p>
      </div>

      <form @submit.prevent="login" class="login-form">
        
        <div class="input-group">
          <label for="username">Usuario</label>
          <input 
            type="text" 
            id="username" 
            v-model="nombreUsuario" 
            required 
            placeholder="ej. lemus"
          />
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            placeholder="••••••••"
          />
        </div>

        <button type="submit" :disabled="isLoading">
          <span v-if="isLoading">Accediendo...</span>
          <span v-else>Iniciar Sesión</span>
        </button>

        <p v-if="error" class="error-message">{{ error }}</p>
      </form>

      <div class="footer">
        <a href="#">¿Olvidaste tu contraseña?</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 
import axios from 'axios'; 

const LOGIN_URL = 'http://localhost:3000/api/auth/login';

const nombreUsuario = ref(''); // 🔑 CAMBIO: Variable para el v-model
const password = ref('');
const isLoading = ref(false);
const error = ref('');
const router = useRouter(); 

const login = async () => {
  error.value = '';
  isLoading.value = true;

  try {
    const response = await axios.post(LOGIN_URL, {
      // 🔑 Envía 'nombre_usuario' y 'password' para coincidir con el backend
      nombre_usuario: nombreUsuario.value, 
      password: password.value,
    });

    const responseData = response.data; 

    if (responseData && responseData.token && responseData.user) {
      
      // Almacenar token y datos del usuario
      localStorage.setItem('userToken', responseData.token);
      localStorage.setItem('userData', JSON.stringify(responseData.user)); 

      router.push('/home'); 
    } else {
      error.value = 'Credenciales correctas, pero la respuesta del servidor fue incompleta.';
    }

  } catch (err) {
    if (err.response && err.response.status === 401) {
      error.value = 'Usuario o contraseña incorrectos.';
    } else if (err.response) {
      error.value = err.response.data.message || 'Error en el servidor. Intenta de nuevo.';
    } else {
      error.value = 'No se pudo conectar al servidor. Verifica tu conexión.';
    }

  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* ========================================================== */
/* ESTILOS DE CENTRADO Y TARJETA */
/* ========================================================== */

/* --- Contenedor Principal (Centrado de pantalla) --- */
.login-container {
    /* Anulamos las propiedades de Flexbox */
    /* width: 100%; */
    /* height: 100%; */ 
    
    /* 🔑 CLAVE: Usamos posicionamiento absoluto para centrar */
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    
    /* Usamos Flexbox para el centrado */
    display: flex;
    justify-content: center; 
    align-items: center; 

}

/* --- Tarjeta de Login (El elemento central) --- */
.login-card {
  width: 100%;
  max-width: 400px; 
  padding: 40px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); 
  text-align: center;
  z-index: 10; 
}

/* --- Encabezado --- */
.header {
  margin-bottom: 30px;
}

.icon {
  font-size: 3em;
  margin-bottom: 10px;
  display: block;
  color: #3498db; 
}

.header h1 {
  font-size: 1.8em;
  color: #333;
  margin-bottom: 5px;
}

.header p {
  color: #777;
  font-size: 0.95em;
}

/* --- Formulario --- */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-group {
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
  font-size: 0.9em;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-sizing: border-box;
}

input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  outline: none;
}

/* --- Botón de Iniciar Sesión --- */
button {
  padding: 12px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

button:hover:not(:disabled) {
  background-color: #2980b9;
}

button:active:not(:disabled) {
  transform: scale(0.99);
}

button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  opacity: 0.8;
}

/* --- Mensaje de Error --- */
.error-message {
  color: #e74c3c;
  font-size: 0.9em;
  margin-top: 10px;
}

/* --- Footer --- */
.footer {
  margin-top: 20px;
  font-size: 0.9em;
}

.footer a {
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s;
}

.footer a:hover {
  text-decoration: underline;
}
</style>