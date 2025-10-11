<template>
  <div class="home-view">
    
    <section class="vehicle-categories">
      <h3>Ingreso de Vehículos por Categoría</h3>
      <div class="cards-grid">
        <div 
          v-for="(category, index) in vehicleCategories" 
          :key="index" 
          class="category-card professional"
          @click="openForm(category.name)" 
          :class="{ 'card-disabled': category.current >= category.limit }"
          :title="category.current >= category.limit ? 'Capacidad Máxima Alcanzada' : 'Registrar Ingreso'"
        >
          
          <div class="card-header">
            <span class="category-icon">{{ category.icon }}</span>
            <h4 class="category-name">{{ category.name }}</h4>
          </div>

          <div class="card-body">
            <p class="category-count">{{ category.current }}/{{ category.limit }}</p>
            <p class="count-label">en proceso</p>
          </div>
          
          <div class="card-footer">
             <span :class="['capacity-indicator', { 'full': category.current >= category.limit }]">
                {{ category.current >= category.limit ? 'CAPACIDAD MÁXIMA' : 'Registrar Ingreso' }}
            </span>
          </div>
        </div>
      </div>
    </section>
    
    <hr class="section-separator">

    <section class="recent-transactions">
      <h3>Transacciones Recientes 🚀</h3>
      <div class="transaction-scroll-container">
        <div v-for="tx in recentTransactions.slice().reverse()" :key="tx.id" class="transaction-card">
          <p class="tx-info">{{ tx.name }} ({{ tx.type }})</p>
          <span :class="['tx-status', tx.status.toLowerCase().replace(/\s/g, '-')]">
            {{ tx.status }}
          </span>
        </div>
        
        <p v-if="recentTransactions.length === 0" class="no-tx">No hay transacciones recientes.</p>
      </div>
    </section>

    <div v-if="isFormOpen" class="modal-overlay" @click.self="closeForm">
      <div class="modal-content">
        <h4>Registro de Ingreso - {{ form.type }}</h4>
        
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="placa">Placa:</label>
                <input id="placa" v-model="form.placa" required placeholder="Ej: HZJ-456">
            </div>
            
            <div class="form-group">
                <label for="numero">Número (ID):</label>
                <input id="numero" v-model="form.numero" required type="number" placeholder="Ej: 47">
            </div>
            
            <div class="form-group">
                <label for="productor">Nombre del Productor:</label>
                <input id="productor" v-model="form.productor" required placeholder="Ej: Juan Pérez">
            </div>
            
            <div class="form-group">
                <label for="conductor">Nombre del Conductor:</label>
                <input id="conductor" v-model="form.conductor" required placeholder="Ej: David Silva">
            </div>
            
            <div class="form-group">
                <label for="origen">Origen:</label>
                <input id="origen" v-model="form.origen" required placeholder="Ej: El Aguacate">
            </div>

            <div class="form-group">
                <label for="status-select">Estado Actual:</label>
                <select id="status-select" v-model="form.status" required>
                    <option v-for="status in vehicleStatuses" :key="status" :value="status">{{ status }}</option>
                </select>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-submit">Guardar Registro</button>
                <button type="button" @click="closeForm" class="btn-cancel">Cancelar</button>
            </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const isFormOpen = ref(false);
const nextId = ref(100); 
const initialFormState = {
    placa: '',
    numero: '',
    productor: '',
    conductor: '',
    origen: '',
    type: '', 
    status: 'En espera de báscula', 
};
const form = reactive({ ...initialFormState });

// --- Datos de Referencia ---
const vehicleCategories = ref([
  { name: 'Volteo Directo', icon: '🚚', limit: 2, current: 0 },
  { name: 'Volteo Indirecto', icon: '🚛', limit: 2, current: 0 },
  { name: 'Chuzo Directo (Grande)', icon: '🚛', limit: 2, current: 0 },
  { name: 'Chuzo Indirecto', icon: '🚚', limit: 2, current: 0 },
  { name: 'Carritos', icon: '🚗', limit: 8, current: 1 },
  { name: 'NPR', icon: '🚐', limit: 4, current: 0 },
]);

const vehicleStatuses = [
    'En espera de báscula',
    'En espera de rampa',
    'En descarga',
    'Descarga finalizada'
];

const recentTransactions = ref([
    { id: 1, name: 'T-4190', type: 'Volteo Directo', status: 'En espera de rampa' },
    { id: 2, name: 'HXB-514', type: 'Carritos', status: 'En descarga' },
    { id: 3, name: 'HRW-521', type: 'NPR', status: 'Descarga finalizada' },
]);


// --- Funcionalidad del Modal y Registro ---

const openForm = (categoryName) => {
    const category = vehicleCategories.value.find(c => c.name === categoryName);
    if (category && category.current < category.limit) {
        Object.assign(form, initialFormState, { type: categoryName });
        isFormOpen.value = true;
    }
};

const closeForm = () => {
    isFormOpen.value = false;
    Object.assign(form, initialFormState); 
};

const submitForm = () => {
    // 1. Crea el nuevo objeto de transacción
    const newTransaction = {
        id: nextId.value++,
        name: form.placa.toUpperCase(), 
        type: form.type,
        status: form.status,
    };

    // 2. Agrega a Transacciones Recientes (Se ve en el scroll inmediatamente)
    recentTransactions.value.push(newTransaction);

    // 3. Incrementa el contador de la tarjeta
    const category = vehicleCategories.value.find(c => c.name === form.type);
    if (category) {
        category.current++;
    }
    
    alert(`Registro de ${form.placa} guardado con estado: ${form.status}`);
    
    closeForm();
};
</script>

<style scoped>
/* ========================================================== */
/* 🔥 ESTILOS BASE Y VARIABLES DE PERSONALIZACIÓN 🔥   */
/* ========================================================== */
:root {
  /* Colores */
  --primary-color: #3498db; 
  --secondary-color: #333;  
  --card-bg: #f5f5dc; /* **NUEVO:** Color Hueso (Beige Suave) */
  --card-border-color: #e0d8c0; /* Borde más sutil */
  --shadow-light: 0 4px 12px rgba(0, 0, 0, 0.1); /* Sombra un poco más visible */

  /* Tipografía y Espaciado */
  --border-radius: 12px; /* Radio de borde más suave */    
  --gap-size: 30px; /* **AUMENTADO:** Espacio entre tarjetas */
}

.home-view { padding: 30px; } /* Más padding general */
h3 { border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 0; color: var(--secondary-color); }
.section-separator { border: 0; height: 1px; background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0)); margin: 40px 0; }

/* --- 1. Tarjetas de Categorías --- */
.cards-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Más flexible pero prioriza el espacio */
    gap: var(--gap-size); 
    margin-top: 20px; 
}

.category-card.professional {
  background-color: var(--card-bg); /* Fondo HUESO */
  border: 1px solid var(--card-border-color); 
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
}
.category-card.professional:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); border-color: var(--primary-color); }
.category-card.professional.card-disabled { cursor: not-allowed; opacity: 0.6; pointer-events: none; }
.card-header { display: flex; align-items: center; margin-bottom: 10px; }
.category-icon { font-size: 2em; margin-right: 10px; }
.category-name { margin: 0; color: var(--secondary-color); font-size: 1.2em; font-weight: 700; }
.card-body { flex-grow: 1; text-align: right; padding-bottom: 15px; }
.category-count { font-size: 2.8em; font-weight: 900; color: var(--primary-color); margin: 0; }
.count-label { font-size: 0.9em; color: #555; margin: 0; text-transform: uppercase; }
.card-footer { padding-top: 10px; border-top: 1px solid #ddd; text-align: center; }

/* **BOTÓN DE REGISTRAR INGRESO VISIBLE** */
.capacity-indicator {
  display: block; 
  padding: 10px; 
  background-color: #e0e0e0; /* Fondo claro visible */
  color: #111; /* Texto negro */
  border: 1px solid #ccc;
  border-radius: 6px; 
  font-weight: 700; 
  font-size: 0.95em; 
  transition: background-color 0.2s;
}
.capacity-indicator.full { background-color: #e74c3c; color: white; border-color: #e74c3c; }


/* --- 2. Scroll de Transacciones Recientes --- */
.recent-transactions { margin-top: 30px; }
.transaction-scroll-container {
  display: flex; overflow-x: auto; padding: 10px 0; gap: var(--gap-size); padding-bottom: 15px;
}
/* ... (Estilos de scroll) ... */
.transaction-card {
  flex: 0 0 300px; 
  padding: 15px; 
  background-color: white; /* Las transacciones se mantienen blancas para contraste */
  border-radius: var(--border-radius); 
  box-shadow: var(--shadow-light); 
  display: flex; 
  flex-direction: column; 
  justify-content: space-between; 
  border-left: 5px solid var(--primary-color);
}
/* ... (Estilos de estado) ... */


/* --- 3. Estilos del Modal y Formulario --- */
/* --- 3. Estilos del Modal y Formulario --- */
/* ------------------------------------------- */

/* Fondo Oscuro Semi-Transparente del Modal */
.modal-overlay { 
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%; 
    background: rgba(0, 0, 0, 0.75); /* Oscuro, se enfoca en el formulario */
    display: flex; 
    justify-content: center; 
    align-items: center; 
    z-index: 1010; 
}

/* Contenido Principal del Formulario */
.modal-content {
    background: white; 
    padding: 30px; 
    border-radius: 12px; /* Bordes suaves */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35); 
    width: 90%; 
    max-width: 450px; /* Tamaño ideal para un formulario centralizado */
    animation: fadeIn 0.3s ease-out; /* Animación para un mejor efecto visual */
}
.modal-content h4 { 
    margin-top: 0; 
    border-bottom: 2px solid #eee; /* Línea separadora */
    padding-bottom: 15px; 
    font-size: 1.4em;
    color: var(--secondary-color);
}

/* Campos de Formulario */
.form-group { margin-bottom: 20px; } /* Más espacio entre campos */

.form-group label { 
    display: block; 
    font-weight: 700; /* Negrita */
    margin-bottom: 8px; 
    color: #111; /* **Letras negras oscuras** para etiquetas */
    font-size: 0.95em;
    text-transform: uppercase;
}
.form-group input, .form-group select {
    width: 100%; 
    padding: 12px; /* Más padding para hacerlos más altos */
    border: 1px solid #ccc; 
    border-radius: 6px; 
    box-sizing: border-box;
    font-size: 1em;
    transition: border-color 0.2s;
}
.form-group input:focus, .form-group select:focus {
    border-color: var(--primary-color); 
    outline: none; /* Quitar el contorno predeterminado del navegador */
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

/* Acciones (Botones) */
.form-actions { display: flex; justify-content: flex-end; margin-top: 30px; }
.btn-submit, .btn-cancel {
    padding: 12px 25px; /* Botones más grandes */
    border: none; 
    border-radius: 6px; 
    cursor: pointer; 
    margin-left: 15px; 
    font-weight: 700; 
    font-size: 1em;
    transition: background-color 0.2s, transform 0.1s;
}

/* Botón Guardar Registro */
.btn-submit { 
    background-color: #27ae60; /* Verde, claro y profesional */
    color: white; 
}
.btn-submit:hover { 
    background-color: #2ecc71; 
    transform: translateY(-1px);
}

/* Botón Cancelar */
.btn-cancel { 
    background-color: #ecf0f1; /* Gris claro */
    color: var(--secondary-color); /* Letras negras */
}
.btn-cancel:hover { 
    background-color: #d5d9dc; 
    transform: translateY(-1px);
}

/* Animación de entrada para el modal */
@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
</style>