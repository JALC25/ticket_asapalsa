<template>
  <div class="manager-container">
    <h1>Administración de Configuración de Vehículos</h1>
    
    <div class="tabs-navigation">
      <button 
        :class="{ 'active': activeTab === 'configs' }" 
        @click="activeTab = 'configs'">
        ⚙️ Configuración Principal
      </button>
      <button 
        :class="{ 'active': activeTab === 'details' }" 
        @click="activeTab = 'details'">
        📝 Detalles de Ingreso
      </button>
    </div>

    <div v-show="activeTab === 'configs'" class="tab-content configs-manager">
      <div class="header-actions">
        <h2>Listado de Configuraciones</h2>
        <div class="search-and-add">
            <input 
                type="text" 
                v-model="searchNameConfig" 
                placeholder="Buscar por Nombre de Configuración..." 
                class="search-input"
            />
            <button class="btn-primary" @click="openConfigModal(null)">
                + Nueva Configuración
            </button>
        </div>
      </div>
      
      <p v-if="isLoadingConfigList">Cargando configuraciones...</p>
      <p v-else-if="paginatedConfigs.length === 0 && !searchNameConfig">No se encontraron configuraciones.</p>
      <p v-else-if="paginatedConfigs.length === 0 && searchNameConfig">No hay resultados para "{{ searchNameConfig }}"</p>

      <div v-else class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre de Configuración</th>
              <th>Detalles Asociados</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="config in paginatedConfigs" :key="config.id">
              <td>{{ config.nombre_configuracion }}</td>
              <td>
                <span v-if="config.detalles && config.detalles.length > 0">
                    {{ config.detalles.length }} detalle(s)
                </span>
                <span v-else class="status-inactive">
                    Sin detalles
                </span>
              </td>
              <td>
                <span :class="config.estado ? 'status-active' : 'status-inactive'">
                    {{ config.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <button class="btn-icon view" title="Ver Detalles" @click="setActiveTabAndFilter('details', config.id)">🔎</button>
                <button class="btn-icon edit" title="Editar Configuración" @click="openConfigModal(config)">✏️</button>
                <button class="btn-icon delete" title="Inactivar" @click="deleteConfig(config.id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="filteredConfigs.length > configItemsPerPage" class="pagination-controls">
          <button 
              @click="prevConfigPage" 
              :disabled="configCurrentPage === 1"
              class="btn-page">
              ← Anterior
          </button>
          <span class="pagination-info">
              Página {{ configCurrentPage }} de {{ totalConfigPages }}
          </span>
          <button 
              @click="nextConfigPage" 
              :disabled="configCurrentPage === totalConfigPages"
              class="btn-page">
              Siguiente →
          </button>
      </div>
    </div>
    
    <div v-show="activeTab === 'details'" class="tab-content details-manager">
        <div class="header-actions">
            <h2>Detalles de Configuración de Ingreso</h2>
            <div class="search-and-add">
                <input 
                    type="text" 
                    v-model="searchDetailType" 
                    placeholder="Filtrar por Configuración o Tipo Vehículo..." 
                    class="search-input"
                />
                <button class="btn-primary" @click="openDetailFormModal(null)">
                    + Nuevo Detalle
                </button>
            </div>
        </div>

        <p v-if="isLoadingConfigList">Cargando detalles...</p>
        <p v-else-if="paginatedDetails.length === 0 && !searchDetailType">No hay detalles de configuración cargados.</p>
        <p v-else-if="paginatedDetails.length === 0 && searchDetailType">No hay resultados para "{{ searchDetailType }}"</p>


        <div v-else class="data-table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Configuración</th>
                        <th>Tipo Vehículo</th>
                        <th>Cantidad Máxima</th>
                        <th>Orden Secuencial</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="detail in paginatedDetails" :key="detail.id_detalle_configuracion">
                        <td>{{ getConfigName(detail.id_configuracion) }}</td>
                        <td>{{ detail.tipo_vehiculo?.tipo_vehiculo || 'ID: ' + detail.id_tipo_vehiculo }}</td> 
                        <td>{{ detail.cantidad_maxima }}</td>
                        <td>{{ detail.orden_secuencial }}</td>
                        <td>
                            <button class="btn-icon edit" title="Editar Detalle" @click="openDetailFormModal(detail)">✏️</button>
                            <button class="btn-icon delete" title="Inactivar" @click="deleteDetail(detail.id_detalle_configuracion)">🗑️</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div v-if="filteredDetails.length > detailItemsPerPage" class="pagination-controls">
            <button 
                @click="prevDetailPage" 
                :disabled="detailCurrentPage === 1"
                class="btn-page">
                ← Anterior
            </button>
            <span class="pagination-info">
                Página {{ detailCurrentPage }} de {{ totalDetailPages }}
            </span>
            <button 
                @click="nextDetailPage" 
                :disabled="detailCurrentPage === totalDetailPages"
                class="btn-page">
                Siguiente →
            </button>
        </div>
    </div>
    
    <Modal v-if="configModal.isOpen" @close="closeConfigModal">
        <template #header>
            <h3>{{ configModal.isEditing ? 'Editar Configuración' : 'Crear Nueva Configuración' }}</h3>
        </template>
        <template #body>
            <form @submit.prevent="saveConfig">
                <div class="form-group">
                    <label>Nombre de Configuración</label>
                    <input type="text" v-model="configForm.nombre_configuracion" placeholder="Ej. Nivel Prioridad Baja" required>
                </div>
                <div class="form-group checkbox-group" v-if="configModal.isEditing">
                    <input type="checkbox" id="configEstado" v-model="configForm.estado">
                    <label for="configEstado">Estado Activo</label>
                </div>
                
                <button type="submit" class="btn-save" :disabled="isLoadingConfig">
                    {{ isLoadingConfig ? 'Guardando...' : 'Guardar Configuración' }}
                </button>
            </form>
        </template>
    </Modal>

    <Modal v-if="detailFormModal.isOpen" @close="closeDetailFormModal">
        <template #header>
            <h3>{{ detailFormModal.isEditing ? 'Editar Detalle de Ingreso' : 'Crear Nuevo Detalle de Ingreso' }}</h3>
        </template>
        <template #body>
            <form @submit.prevent="saveDetail">
                <div class="form-group">
                    <label>Configuración Principal</label>
                    <select v-model.number="detailForm.id_configuracion" required>
                        <option :value="null" disabled>Seleccionar Configuración</option>
                        <option v-for="config in activeConfigs" :key="config.id" :value="config.id">
                            {{ config.nombre_configuracion }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Tipo Vehículo</label>
                    <select v-model.number="detailForm.id_tipo_vehiculo" required>
                        <option :value="null" disabled>Seleccionar Tipo de Vehículo</option>
                        <option v-for="type in activeVehicleTypes" :key="type.id" :value="type.id">
                            {{ type.tipo_vehiculo }}
                        </option>
                    </select>
                    <p v-if="isLoadingVehicleTypes">Cargando tipos de vehículo...</p>
                    <p v-else-if="!activeVehicleTypes.length && !isLoadingVehicleTypes" class="status-inactive">
                        No hay tipos de vehículo activos cargados. (Revise la API: {{ VEHICLE_TYPE_URL }})
                    </p>
                </div>
                <div class="form-group">
                    <label>Cantidad Máxima</label>
                    <input type="number" v-model.number="detailForm.cantidad_maxima" required>
                </div>
                <div class="form-group">
                    <label>Orden Secuencial</label>
                    <input type="number" v-model.number="detailForm.orden_secuencial" required>
                </div>
                
                <button type="submit" class="btn-save" :disabled="isLoadingDetail">
                    {{ isLoadingDetail ? 'Guardando...' : 'Guardar Detalle' }}
                </button>
            </form>
        </template>
    </Modal>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'; 
import axios from 'axios';
import Modal from '../components/Modal.vue'; 

// ____________________________________________________
// CONSTANTES DE API
// ____________________________________________________
const API_URL = 'http://localhost:3000/api';
const CONFIG_URL = `${API_URL}/configuraciones`; 
const DETAIL_URL = `${API_URL}/configuraciones/detalle`; 
// ✅ URL CORREGIDA
const VEHICLE_TYPE_URL = `${API_URL}/tipos-vehiculo`; 

// ____________________________________________________
// ESTADOS GLOBALES Y DE CARGA
// ____________________________________________________
const activeTab = ref('configs'); 
const configs = ref([]); 
const allDetails = ref([]); 
const vehicleTypes = ref([]); 
const isLoadingConfig = ref(false); 
const isLoadingDetail = ref(false); 
const isLoadingConfigList = ref(true); 
const isLoadingVehicleTypes = ref(true); 

// VARIABLES DE PAGINACIÓN
const configCurrentPage = ref(1); 
const configItemsPerPage = 10; // 👈 ITEMS POR PÁGINA
const detailCurrentPage = ref(1); 
const detailItemsPerPage = 10; // 👈 ITEMS POR PÁGINA

// ESTADOS DE BÚSQUEDA
const searchNameConfig = ref(''); 
const searchDetailType = ref(''); 

// ____________________________________________________
// PETICIONES DE CARGA DE DATOS Y NORMALIZACIÓN
// ____________________________________________________

const fetchVehicleTypes = async () => {
    isLoadingVehicleTypes.value = true;
    try {
        const response = await axios.get(VEHICLE_TYPE_URL); 
        const data = response.data.data || response.data;
        
        vehicleTypes.value = data.map(v => ({
            id: v.id_tipo_vehiculo || v.id, 
            tipo_vehiculo: v.tipo_vehiculo,
            estado: v.estado
        })).filter(v => {
            // ✅ FILTRO FLEXIBLE (Acepta true, 1, 'true', '1')
            const estado = v.estado;
            return estado === true || estado === 1 || estado === 'true' || estado === '1';
        }); 
        
        if (!vehicleTypes.value.length) {
            console.warn(`No se encontraron tipos de vehículo activos en ${VEHICLE_TYPE_URL}`);
        }
        
    } catch (error) {
        console.error('Error al obtener tipos de vehículo. Revise la URL y el formato de la API:', error);
    } finally {
        isLoadingVehicleTypes.value = false;
    }
};

const fetchConfigs = async () => {
    isLoadingConfigList.value = true;
    try {
        const response = await axios.get(CONFIG_URL);
        const data = response.data.data || []; 
        
        const fetchedConfigs = data.map(c => ({
            ...c, 
            id: c.id_configuracion || c.id, 
            detalles: c.detalles || [] 
        }))
        // ORDENAMIENTO: Mostrar los más recientes primero (por id descendente)
        .sort((a, b) => b.id - a.id);
        
        configs.value = fetchedConfigs;
        
        // NORMALIZAR DETALLES:
        allDetails.value = fetchedConfigs.flatMap(config => 
            (config.detalles || []).map(detail => ({
                ...detail,
                id_detalle_configuracion: detail.id_detalle_configuracion, 
                id_configuracion: config.id
            }))
        )
        // ORDENAMIENTO: Mostrar los más recientes primero (por id_detalle_configuracion descendente)
        .sort((a, b) => b.id_detalle_configuracion - a.id_detalle_configuracion); 

        // Reiniciar paginación al cargar nuevos datos
        configCurrentPage.value = 1;
        detailCurrentPage.value = 1;
        
    } catch (error) {
        console.error('Error al obtener configuraciones:', error);
        alert('Error al cargar la lista de configuraciones y detalles. Asegúrate de que la API está en 3000 y el formato de respuesta es correcto.');
    } finally {
        isLoadingConfigList.value = false;
    }
};

fetchConfigs(); 
fetchVehicleTypes(); 

// ____________________________________________________
// FUNCIONES DE UTILIDAD Y COMPUTADAS (PAGINACIÓN Y FILTROS)
// ____________________________________________________

const getConfigName = (id) => {
    const config = configs.value.find(c => c.id === id);
    return config ? config.nombre_configuracion : 'ID Desconocido';
};

const setActiveTabAndFilter = (tab, configId) => {
    activeTab.value = tab;
    if (tab === 'details' && configId) {
        searchDetailType.value = String(configId);
    }
};

// --- CONFIGURACIÓN ---
const filteredConfigs = computed(() => {
    const search = searchNameConfig.value.trim().toLowerCase();
    return configs.value.filter(config => config.nombre_configuracion.toLowerCase().includes(search));
});
const totalConfigPages = computed(() => Math.ceil(filteredConfigs.value.length / configItemsPerPage));
const paginatedConfigs = computed(() => {
    const start = (configCurrentPage.value - 1) * configItemsPerPage;
    return filteredConfigs.value.slice(start, start + configItemsPerPage);
});

// --- DETALLES ---
const activeConfigs = computed(() => configs.value.filter(c => c.estado));
const activeVehicleTypes = computed(() => vehicleTypes.value); 
const filteredDetails = computed(() => {
    const search = searchDetailType.value.trim().toLowerCase();
    if (!search) return allDetails.value;
    
    return allDetails.value.filter(detail => {
        const configName = getConfigName(detail.id_configuracion).toLowerCase();
        const vehicleTypeName = detail.tipo_vehiculo?.tipo_vehiculo?.toLowerCase() || '';

        return (
            String(detail.id_configuracion).includes(search) ||
            configName.includes(search) ||
            vehicleTypeName.includes(search)
        );
    });
});
const totalDetailPages = computed(() => Math.ceil(filteredDetails.value.length / detailItemsPerPage));
const paginatedDetails = computed(() => {
    const start = (detailCurrentPage.value - 1) * detailItemsPerPage;
    return filteredDetails.value.slice(start, start + detailItemsPerPage);
});

// GESTIÓN DE PÁGINAS 
const nextConfigPage = () => { if (configCurrentPage.value < totalConfigPages.value) configCurrentPage.value++; };
const prevConfigPage = () => { if (configCurrentPage.value > 1) configCurrentPage.value--; };
const nextDetailPage = () => { if (detailCurrentPage.value < totalDetailPages.value) detailCurrentPage.value++; };
const prevDetailPage = () => { if (detailCurrentPage.value > 1) detailCurrentPage.value--; };

// ____________________________________________________
// CRUD: CONFIGURACIÓN PRINCIPAL
// ____________________________________________________

const configModal = reactive({ isOpen: false, isEditing: false, configId: null });
const configForm = reactive({ nombre_configuracion: '', estado: true });
const resetConfigForm = () => { Object.assign(configForm, { nombre_configuracion: '', estado: true }); };

const openConfigModal = (config) => {
    resetConfigForm();
    if (config) {
        configModal.isEditing = true;
        configModal.configId = config.id; 
        configForm.nombre_configuracion = config.nombre_configuracion;
        configForm.estado = config.estado;
    } else {
        configModal.isEditing = false;
        configModal.configId = null;
    }
    configModal.isOpen = true;
};
const closeConfigModal = () => { configModal.isOpen = false; };
const saveConfig = async () => {
    isLoadingConfig.value = true;
    const dataToSend = { nombre_configuracion: configForm.nombre_configuracion };
    try {
        if (configModal.isEditing) {
            dataToSend.estado = configForm.estado; 
            await axios.put(`${CONFIG_URL}/${configModal.configId}`, dataToSend);
            alert('Configuración actualizada con éxito!');
        } else {
            await axios.post(CONFIG_URL, dataToSend);
            alert('Configuración creada con éxito!');
        }
        closeConfigModal();
        fetchConfigs(); // Recarga y ordena
    } catch (error) {
        console.error('Error al guardar configuración:', error);
        alert(`Error al guardar configuración: ${error.response?.data?.message || 'Error de conexión.'}`);
    } finally {
        isLoadingConfig.value = false;
    }
};
const deleteConfig = async (id) => {
    const configIdToDelete = Number(id);
    if (!confirm('¿Estás seguro de que quieres INACTIVAR esta configuración? (Lógica)')) return;
    try {
        await axios.put(`${CONFIG_URL}/${configIdToDelete}`, { estado: false });
        alert('Configuración inactivada con éxito!');
        fetchConfigs(); 
    } catch (error) {
        console.error('Error al inactivar configuración:', error);
        alert('Error al inactivar configuración.');
    }
};


// ____________________________________________________
// CRUD: DETALLES DE CONFIGURACIÓN 
// ____________________________________________________

const detailFormModal = reactive({ isOpen: false, isEditing: false, detailId: null });
const detailForm = reactive({
    id_configuracion: null,
    id_tipo_vehiculo: null,
    cantidad_maxima: null,
    orden_secuencial: null,
});

const resetDetailForm = () => {
    Object.assign(detailForm, {
        id_configuracion: activeConfigs.value.length ? activeConfigs.value[0].id : null,
        id_tipo_vehiculo: null,
        cantidad_maxima: null,
        orden_secuencial: null,
    });
};

const openDetailFormModal = (detail) => {
    resetDetailForm();
    
    if (detail) {
        detailFormModal.isEditing = true;
        detailFormModal.detailId = detail.id_detalle_configuracion; 
        detailForm.id_configuracion = detail.id_configuracion;
        detailForm.id_tipo_vehiculo = detail.id_tipo_vehiculo;
        detailForm.cantidad_maxima = detail.cantidad_maxima;
        detailForm.orden_secuencial = detail.orden_secuencial;

    } else {
        detailFormModal.isEditing = false;
        detailFormModal.detailId = null;
    }
    
    if (!vehicleTypes.value.length && !isLoadingVehicleTypes.value) {
        fetchVehicleTypes();
    }
    
    detailFormModal.isOpen = true;
};

const closeDetailFormModal = () => { detailFormModal.isOpen = false; };

const saveDetail = async () => {
    isLoadingDetail.value = true;
    
    if (!detailForm.id_configuracion || !detailForm.id_tipo_vehiculo) {
        alert('Por favor, selecciona una Configuración Principal y un Tipo de Vehículo.');
        isLoadingDetail.value = false;
        return;
    }

    const dataToSend = {
        id_configuracion: detailForm.id_configuracion,
        id_tipo_vehiculo: detailForm.id_tipo_vehiculo,
        cantidad_maxima: detailForm.cantidad_maxima,
        orden_secuencial: detailForm.orden_secuencial,
    };

    try {
        if (detailFormModal.isEditing) {
            const detailIdToUpdate = detailFormModal.detailId;
            await axios.put(`${DETAIL_URL}/${detailIdToUpdate}`, dataToSend);
            alert('Detalle actualizado con éxito!');
        } else {
            await axios.post(DETAIL_URL, dataToSend);
            alert('Detalle creado con éxito!');
        }
        
        closeDetailFormModal();
        fetchConfigs(); // Recarga y ordena
        
    } catch (error) {
        console.error('Error al guardar detalle:', error);
        alert(`Error al guardar detalle: ${error.response?.data?.message || 'Error de conexión o datos duplicados.'}`);
    } finally {
        isLoadingDetail.value = false;
    }
};

const deleteDetail = async (id) => {
    const detailIdToDelete = Number(id);

    if (!confirm('¿Estás seguro de que quieres INACTIVAR este detalle?')) return;
    
    try {
        await axios.put(`${DETAIL_URL}/${detailIdToDelete}`, { estado: false });
        alert('Detalle inactivado con éxito!');
        fetchConfigs(); 
    } catch (error) {
        console.error('Error al inactivar detalle:', error);
        alert('Error al inactivar detalle.');
    }
};
</script>

<style scoped>
/* -------------------- ESTILOS COPIADOS Y AJUSTADOS -------------------- */
.manager-container {
    padding: 20px;
    background-color: #f8f9fa; 
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    /* ✅ AJUSTE PARA EL ANCHO MÁXIMO DEL CONTENEDOR */
    max-width: 1400px; 
    margin: 0 auto;    /* Centra el contenedor */
}

h1 {
    font-size: 2.2em;
    color: #34495e;
    border-bottom: 2px solid #ecf0f1;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

/* -------------------- TABS NAVIGATION -------------------- */
.tabs-navigation {
    display: flex;
    border-bottom: 2px solid #3498db;
    margin-bottom: 20px;
}

.tabs-navigation button {
    padding: 12px 25px;
    border: none;
    background-color: #ecf0f1;
    color: #34495e;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.3s, color 0.3s;
    border-radius: 6px 6px 0 0;
    margin-right: 5px;
    border-bottom: 3px solid transparent;
}

.tabs-navigation button:hover {
    background-color: #e0e6e9;
}

.tabs-navigation button.active {
    background-color: #3498db;
    color: white;
    border-bottom: 3px solid #3498db;
}

/* -------------------- HEADER Y BOTONES -------------------- */
.header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.header-actions h2 {
    font-size: 1.6em;
    color: #2c3e50;
    margin: 0;
}

.search-and-add {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* Estilo para la caja de texto (search input) */
.search-input {
    padding: 10px;
    border: 1px solid #bdc3c7;
    border-radius: 6px;
    width: 250px; 
    transition: border-color 0.3s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
    border-color: #3498db; 
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.btn-primary {
    padding: 10px 20px;
    background-color: #2ecc71;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 700;
    transition: background-color 0.3s;
}

.btn-primary:hover {
    background-color: #27ae60;
}

/* -------------------- TABLA DE DATOS -------------------- */
.data-table-container {
    overflow-x: auto;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 15px;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95em;
}

.data-table th, .data-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ecf0f1;
}

.data-table th {
    background-color: #f4f6f9;
    color: #7f8c8d;
    font-weight: 700;
    text-transform: uppercase;
}

.data-table tbody tr:hover {
    background-color: #f9fbfd;
}

/* Estados */
.status-active {
    background-color: #e6f7e9;
    color: #27ae60;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 600;
}
.status-inactive {
    background-color: #f9e6e6;
    color: #e74c3c;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 600;
}

/* ESTILO PARA BOTONES DE ACCIÓN HORIZONTALES */
.btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1em;
    padding: 5px; 
    margin: 0 2px; 
    transition: transform 0.1s;
    line-height: 1; 
    display: inline-block; 
}

.btn-icon:hover {
    transform: scale(1.1);
}

.btn-icon.delete { color: #e74c3c; }
.btn-icon.edit { color: #f39c12; }
.btn-icon.view { color: #3498db; }

/* -------------------- FORMULARIOS EN MODAL (MODERNO) -------------------- */
.form-group {
    margin-bottom: 15px;
    text-align: left;
}

.form-group label {
    display: block;
    font-weight: 600;
    color: #555;
    margin-bottom: 5px;
    font-size: 0.9em;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 12px;
    border: 1px solid #bdc3c7;
    border-radius: 6px;
    box-sizing: border-box;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus,
.form-group select:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    outline: none;
}

.checkbox-group {
    display: flex;
    align-items: center;
}
.checkbox-group input[type="checkbox"] {
    width: auto;
    margin-right: 10px;
}
.checkbox-group label {
    margin-bottom: 0;
    font-weight: 400;
}

.btn-save {
    width: 100%;
    padding: 12px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 700;
    margin-top: 20px;
    transition: background-color 0.3s;
}
.btn-save:hover:not(:disabled) {
    background-color: #2980b9;
}
.btn-save:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
}

/* -------------------- PAGINACIÓN -------------------- */
.pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    padding: 15px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-page {
    padding: 8px 15px;
    margin: 0 10px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.3s;
}

.btn-page:hover:not(:disabled) {
    background-color: #2980b9;
}

.btn-page:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
}

.pagination-info {
    font-weight: 600;
    color: #34495e;
    font-size: 1em;
}
</style>