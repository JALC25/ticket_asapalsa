<template>
  <div class="manager-container">
    <h1>Administración Central</h1>
    
    <div class="tabs-navigation">
      <button 
        :class="{ 'active': activeTab === 'users' }" 
        @click="activeTab = 'users'">
        👥 Gestión de Usuarios
      </button>
      <button 
        :class="{ 'active': activeTab === 'roles' }" 
        @click="activeTab = 'roles'">
        🛡️ Gestión de Roles
      </button>
    </div>

    <div v-show="activeTab === 'users'" class="tab-content users-manager">
      <div class="header-actions">
        <h2>Listado de Usuarios</h2>
        <div class="search-and-add">
            <input 
                type="text" 
                v-model="searchNameUser" 
                placeholder="Buscar por Nombre o Usuario..." 
                class="search-input"
            />
            <button class="btn-primary" @click="openUserModal(null)">
                + Nuevo Usuario
            </button>
        </div>
      </div>
      
      <p v-if="isLoadingUserList">Cargando usuarios...</p>
      <p v-else-if="filteredUsers.length === 0 && !searchNameUser">No se encontraron usuarios.</p>
      <p v-else-if="filteredUsers.length === 0 && searchNameUser">No hay resultados para "{{ searchNameUser }}"</p>

      <div v-else class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.nombre }}</td>
              <td>{{ user.nombre_usuario }}</td>
              <td>{{ user.correo }}</td>
              <td>{{ getRoleName(user.id_role) }}</td> 
              <td>
                <span :class="user.estado ? 'status-active' : 'status-inactive'">
                    {{ user.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <button class="btn-icon edit" @click="openUserModal(user)">✏️</button>
                <button class="btn-icon delete" @click="deleteUser(user.id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="filteredUsers.length >= itemsPerPage" class="pagination-controls">
          <button 
              @click="prevPage" 
              :disabled="currentPage === 1"
              class="btn-page">
              ← Anterior
          </button>
          <span class="pagination-info">
              Página {{ currentPage }} de {{ totalPages }}
          </span>
          <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="btn-page">
              Siguiente →
          </button>
      </div>

    </div>

    <div v-show="activeTab === 'roles'" class="tab-content roles-manager">
      <div class="header-actions">
        <h2>Listado de Roles</h2>
        <div class="search-and-add">
            <input 
                type="text" 
                v-model="searchNameRole" 
                placeholder="Buscar por Nombre de Rol..." 
                class="search-input"
            />
            <button class="btn-primary" @click="openRoleModal(null)">
                + Nuevo Rol
            </button>
        </div>
      </div>
      
      <p v-if="isLoadingRoleList">Cargando roles...</p>
      <p v-else-if="filteredRoles.length === 0 && !searchNameRole">No se encontraron roles.</p>
      <p v-else-if="filteredRoles.length === 0 && searchNameRole">No hay resultados para "{{ searchNameRole }}"</p>

      <div v-else class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Rol</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in filteredRoles" :key="role.id">
              <td>{{ role.id }}</td>
              <td>{{ role.nombre_role }}</td>
              <td>{{ role.descripcion }}</td>
              <td>
                <span :class="role.estado ? 'status-active' : 'status-inactive'">
                    {{ role.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <button class="btn-icon edit" @click="openRoleModal(role)">✏️</button>
                <button class="btn-icon delete" @click="deleteRole(role.id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <Modal v-if="userModal.isOpen" @close="closeUserModal">
        <template #header>
            <h3>{{ userModal.isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}</h3>
        </template>
        <template #body>
            <form @submit.prevent="saveUser">
                <div class="form-group">
                    <label>Nombre Completo</label>
                    <input type="text" v-model="userForm.nombre" placeholder="Nombre Completo" required>
                </div>
                <div class="form-group">
                    <label>Nombre de Usuario</label>
                    <input type="text" v-model="userForm.nombre_usuario" placeholder="Nombre de Usuario" required>
                </div>
                <div class="form-group">
                    <label>Contraseña</label>
                    <input type="password" v-model="userForm.password" placeholder="Mínimo 6 caracteres" :required="!userModal.isEditing">
                    <small v-if="userModal.isEditing">Dejar vacío para no cambiar la contraseña.</small>
                </div>
                <div class="form-group">
                    <label>Correo Electrónico</label>
                    <input type="email" v-model="userForm.correo" placeholder="ejemplo@dominio.com" required>
                </div>
                <div class="form-group">
                    <label>Rol</label>
                    <select v-model.number="userForm.id_role" required>
                        <option value="" disabled>Seleccionar Rol</option>
                        <option v-for="role in roles" :key="role.id" :value="role.id">
                            {{ role.nombre_role }}
                        </option>
                    </select>
                </div>
                <div class="form-group checkbox-group">
                    <input type="checkbox" id="userEstado" v-model="userForm.estado">
                    <label for="userEstado">Estado Activo</label>
                </div>
                
                <button type="submit" class="btn-save" :disabled="isLoadingUser">
                    {{ isLoadingUser ? 'Guardando...' : 'Guardar Usuario' }}
                </button>
            </form>
        </template>
    </Modal>
    
    <Modal v-if="roleModal.isOpen" @close="closeRoleModal">
        <template #header>
            <h3>{{ roleModal.isEditing ? 'Editar Rol' : 'Crear Nuevo Rol' }}</h3>
        </template>
        <template #body>
            <form @submit.prevent="saveRole">
                <div class="form-group">
                    <label>Nombre del Rol</label>
                    <input type="text" v-model="roleForm.nombre_role" placeholder="Ej. Lector" required>
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea v-model="roleForm.descripcion" placeholder="Detalle las funciones del rol." rows="3" required></textarea>
                </div>
                <div class="form-group checkbox-group">
                    <input type="checkbox" id="roleEstado" v-model="roleForm.estado">
                    <label for="roleEstado">Estado Activo</label>
                </div>
                
                <button type="submit" class="btn-save" :disabled="isLoadingRole">
                    {{ isLoadingRole ? 'Guardando...' : 'Guardar Rol' }}
                </button>
            </form>
        </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'; 
import axios from 'axios';
import Modal from '../components/Modal.vue'; 

// ____________________________________________________
// CONSTANTES DE API
// ____________________________________________________
const API_URL = 'http://localhost:3000/api';
const USERS_URL = `${API_URL}/usuarios`; 
const ROLES_URL = `${API_URL}/roles`;     

// ____________________________________________________
// ESTADOS GLOBALES Y DE CARGA
// ____________________________________________________
const activeTab = ref('users'); 
const isLoadingUser = ref(false); 
const isLoadingRole = ref(false); 
const isLoadingUserList = ref(true); 
const isLoadingRoleList = ref(true); 

// DATOS PRINCIPALES
const users = ref([]); 
const roles = ref([]); 

// 🔑 VARIABLES DE PAGINACIÓN
const currentPage = ref(1); // La página que se muestra actualmente
const itemsPerPage = 5;    // Cuántos usuarios mostrar por página

// ESTADOS DE BÚSQUEDA POR NOMBRE
const searchNameUser = ref(''); 
const searchNameRole = ref('');

// ____________________________________________________
// PETICIONES DE CARGA DE DATOS 
// ____________________________________________________

const fetchUsers = async () => {
    isLoadingUserList.value = true;
    try {
        const response = await axios.get(USERS_URL);
        
        // Mapeamos 'id_usuario' de la API a 'id' de Vue
        users.value = response.data.map(u => ({
            ...u, 
            id: u.id_usuario || u.id 
        })).sort((a, b) => b.id - a.id);

        // Reiniciar la paginación al cargar nuevos datos
        currentPage.value = 1; 
        
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        alert('Error al cargar la lista de usuarios. Asegúrate de que tu API esté corriendo en el puerto 3000.');
    } finally {
        isLoadingUserList.value = false;
    }
};

const fetchRoles = async () => {
    isLoadingRoleList.value = true;
    try {
        const response = await axios.get(ROLES_URL);
        
        const mappedRoles = response.data.map(role => ({
            id: role.id_role || role.id,          
            nombre_role: role.nombre_role,
            descripcion: role.descripcion,
            estado: role.estado
        }));
        
        roles.value = mappedRoles.sort((a, b) => b.id - a.id); 

    } catch (error) {
        console.error('Error al obtener roles:', error);
    } finally {
        isLoadingRoleList.value = false;
    }
};

onMounted(() => {
    fetchRoles(); 
    fetchUsers(); 
});

// FUNCIÓN PARA OBTENER EL NOMBRE DEL ROL
const getRoleName = (id_role) => {
    const roleId = Number(id_role); 
    
    if (!roleId || roles.value.length === 0) return 'ID Desconocido';
    
    const role = roles.value.find(r => r.id === roleId); 
    
    return role ? role.nombre_role : 'ID Desconocido';
};

// ____________________________________________________
// FILTRO Y PAGINACIÓN (PROPIEDADES COMPUTADAS)
// ____________________________________________________

const filteredUsers = computed(() => {
    const search = searchNameUser.value.trim().toLowerCase();
    
    const filtered = users.value.filter(user => 
        user.nombre.toLowerCase().includes(search) ||
        user.nombre_usuario.toLowerCase().includes(search)
    );
    
    if (search) {
        currentPage.value = 1;
    }

    return filtered;
});

const filteredRoles = computed(() => {
    const search = searchNameRole.value.trim().toLowerCase();
    if (!search) {
        return roles.value;
    }
    
    return roles.value.filter(role => 
        role.nombre_role.toLowerCase().includes(search)
    );
});


// PROPIEDAD COMPUTADA PARA APLICAR LA PAGINACIÓN
const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredUsers.value.slice(start, end);
});

// COMPUTADA PARA EL NÚMERO TOTAL DE PÁGINAS
const totalPages = computed(() => {
    return Math.ceil(filteredUsers.value.length / itemsPerPage);
});

// ____________________________________________________
// GESTIÓN DE PÁGINAS (NUEVAS FUNCIONES)
// ____________________________________________________

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

// ____________________________________________________
// GESTIÓN DE USUARIOS (CRUD)
// ____________________________________________________
const userModal = reactive({
    isOpen: false,
    isEditing: false,
    userId: null, 
});

const userForm = reactive({
    nombre: '',
    nombre_usuario: '',
    password: '',
    correo: '',
    id_role: '', 
    estado: true,
});

const resetUserForm = () => {
    Object.assign(userForm, {
        nombre: '',
        nombre_usuario: '',
        password: '',
        correo: '',
        id_role: '', 
        estado: true,
    });
};

const openUserModal = (user) => {
    resetUserForm();
    if (user) {
        userModal.isEditing = true;
        
        userModal.userId = Number(user.id); 

        userForm.nombre = user.nombre;
        userForm.nombre_usuario = user.nombre_usuario;
        userForm.correo = user.correo;
        userForm.id_role = Number(user.id_role); 
        userForm.estado = user.estado;
        userForm.password = ''; 
        
    } else {
        userModal.isEditing = false;
        userModal.userId = null;
    }
    userModal.isOpen = true;
};

const closeUserModal = () => {
    userModal.isOpen = false;
};

const saveUser = async () => {
    isLoadingUser.value = true;
    
    const dataToSend = {
        nombre: userForm.nombre,
        nombre_usuario: userForm.nombre_usuario,
        correo: userForm.correo,
        id_role: userForm.id_role, 
        estado: userForm.estado,
    };
    
    if (!dataToSend.id_role) {
        alert('Debe seleccionar un Rol válido.');
        isLoadingUser.value = false;
        return;
    }

    // --- Edición (PUT) ---
    if (userModal.isEditing) {
        const userIdToUpdate = Number(userModal.userId);

        if (!userIdToUpdate || isNaN(userIdToUpdate)) {
            alert('Error: ID de usuario no válido para la actualización.');
            isLoadingUser.value = false;
            return;
        }

        if (userForm.password && userForm.password.length > 0) {
            dataToSend.password = userForm.password;
        } else {
            delete dataToSend.password; 
        }
        
        try {
            await axios.put(`${USERS_URL}/${userIdToUpdate}`, dataToSend);
            alert('Usuario actualizado con éxito!');
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            const apiMessage = error.response?.data?.message || 'Error de conexión.';
            alert(`Error al guardar usuario: ${apiMessage}`);
        }
        
    } else {
        // --- Creación (POST) ---
        if (!userForm.password || userForm.password.length === 0) {
            alert('La contraseña es requerida para nuevos usuarios.');
            isLoadingUser.value = false;
            return;
        }
        dataToSend.password = userForm.password;
        
        try {
            await axios.post(USERS_URL, dataToSend);
            alert('Usuario creado con éxito!');
        } catch (error) {
            console.error('Error al crear usuario:', error);
            const apiMessage = error.response?.data?.message || 'Verifique la conexión y los datos ingresados.';
            alert(`Error al guardar usuario: ${apiMessage}`);
        }
    }
    
    closeUserModal();
    fetchUsers(); 
    isLoadingUser.value = false;
};

// ELIMINACIÓN LÓGICA (PUT para cambiar estado a Inactivo)
const deleteUser = async (id) => {
    const userIdToDelete = Number(id);
    
    if (isNaN(userIdToDelete) || userIdToDelete <= 0) {
        alert('Error: ID de usuario no válido para la eliminación.');
        return;
    }

    if (!confirm('¿Estás seguro de que quieres INACTIVAR este usuario? (Eliminación lógica)')) return;
    
    const logicalDeletePayload = {
        estado: false
    };
    
    try {
        await axios.put(`${USERS_URL}/${userIdToDelete}`, logicalDeletePayload);
        alert('Usuario inactivado (eliminación lógica) con éxito!');
        fetchUsers(); 
    } catch (error) {
        console.error('Error al inactivar usuario:', error);
        alert('Error al inactivar usuario. La API respondió con error.');
    }
};


// ____________________________________________________
// GESTIÓN DE ROLES (CRUD)
// ____________________________________________________

const roleModal = reactive({
    isOpen: false,
    isEditing: false,
    roleId: null,
});

const roleForm = reactive({
    nombre_role: '',
    descripcion: '',
    estado: true,
});

const resetRoleForm = () => {
    Object.assign(roleForm, {
        nombre_role: '',
        descripcion: '',
        estado: true,
    });
};

const openRoleModal = (role) => {
    resetRoleForm();
    if (role) {
        roleModal.isEditing = true;
        roleModal.roleId = role.id;
        
        roleForm.nombre_role = role.nombre_role;
        roleForm.descripcion = role.descripcion;
        roleForm.estado = role.estado;
        
    } else {
        roleModal.isEditing = false;
        roleModal.roleId = null;
    }
    roleModal.isOpen = true;
};

const closeRoleModal = () => {
    roleModal.isOpen = false;
};

const saveRole = async () => {
    isLoadingRole.value = true;
    
    const dataToSend = {
        nombre_role: roleForm.nombre_role,
        descripcion: roleForm.descripcion,
        estado: roleForm.estado,
    };
    
    try {
        if (roleModal.isEditing) {
            if (!roleModal.roleId) {
                alert('Error: ID de rol no encontrado para la actualización.');
                isLoadingRole.value = false;
                return;
            }
            await axios.put(`${ROLES_URL}/${roleModal.roleId}`, dataToSend);
            alert('Rol actualizado con éxito!');
        } else {
            await axios.post(ROLES_URL, dataToSend);
            alert('Rol creado con éxito!');
        }
        
        closeRoleModal();
        fetchRoles(); 
        fetchUsers(); 
        
    } catch (error) {
        console.error('Error al guardar rol:', error);
        alert('Error al guardar rol: ' + (error.response?.data?.message || 'Error de conexión'));
    } finally {
        isLoadingRole.value = false;
    }
};

const deleteRole = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este rol? Se desvincularán todos los usuarios.')) return;
    try {
        await axios.delete(`${ROLES_URL}/${id}`);
        alert('Rol eliminado con éxito!');
        fetchRoles(); 
        fetchUsers(); 
    } catch (error) {
        console.error('Error al eliminar rol:', error);
        alert('Error al eliminar rol: ' + (error.response?.data?.message || 'Error de conexión'));
    }
};
</script>

<style scoped>
/* Estilos para la interfaz de usuario */
.manager-container {
    padding: 20px;
    background-color: #f8f9fa; 
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
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
    width: 150px; 
    transition: width 0.3s, border-color 0.3s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
    border-color: #3498db; 
    width: 250px; 
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

/* Botones de Acción en Tabla */
.btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1em;
    margin-right: 5px;
    padding: 5px;
    transition: transform 0.1s;
}

.btn-icon:hover {
    transform: scale(1.1);
}

.btn-icon.delete { color: #e74c3c; }
.btn-icon.edit { color: #f39c12; }

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

.form-group input[type="text"],
.form-group input[type="password"],
.form-group input[type="email"],
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #bdc3c7;
    border-radius: 6px;
    box-sizing: border-box;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    outline: none;
}

.form-group small {
    display: block;
    color: #95a5a6;
    margin-top: 5px;
    font-size: 0.8em;
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