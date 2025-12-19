<template>
  <ion-header>
    <ion-toolbar class="header-toolbar">
      <ion-buttons slot="start">
        <ion-button @click="router.push('/')">
          <img src="/logo.png" alt="Logo" style="width: 40px; height: 40px;" />
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button @click="toggleBusqueda">
          <ion-icon slot="icon-only" :icon="searchOutline"></ion-icon>
        </ion-button>
        <ion-button v-if="store.isAdmin" @click="toggleAdminMenu">
          <ion-icon slot="icon-only" :icon="createOutline" style="color: black;"></ion-icon>
        </ion-button>
        <ion-button @click="store.isLogged ? toggleUserMenu() : router.push('/login')">
          <ion-icon slot="icon-only" :icon="personOutline"></ion-icon>
        </ion-button>
        <ion-button @click="toggleFiltros">
          <ion-icon slot="icon-only" :icon="menuOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>

    <ion-toolbar v-if="mostrarBusqueda" class="header-toolbar">
      <ion-searchbar v-model="textoBusqueda" placeholder="Buscar receta..." @keyup.enter="realizarBusqueda" @ionClear="limpiarBusqueda" animated></ion-searchbar>
    </ion-toolbar>

    <ion-toolbar v-if="showAdminMenu || mostrarFiltros || showUserMenu" class="dropdown-toolbar">
      
      <div v-if="showAdminMenu" class="custom-dropdown-content">
        <ion-list lines="full">
          <ion-item-divider class="dropdown-divider"><ion-label>ADMINISTRACIÓN</ion-label></ion-item-divider>
          <ion-item button @click="navegarA('/list')"><ion-label>Gestión de Recetas</ion-label></ion-item>
          <ion-item button @click="navegarA('/listcomments')"><ion-label>Gestión de Comentarios</ion-label></ion-item>
        </ion-list>
      </div>
      
      <div v-if="mostrarFiltros" class="custom-dropdown-content">
        <ion-list lines="full">
          <ion-item button @click="filtrarPor('guardados')"><ion-label>Recetas Guardadas ❤️</ion-label></ion-item>
          <ion-item-divider class="dropdown-divider"><ion-label>CATEGORÍAS</ion-label></ion-item-divider>
          <ion-item button @click="filtrarPor('')"><ion-label>Todas</ion-label></ion-item>
          <ion-item button @click="filtrarPor('Salado')"><ion-label>Salado</ion-label></ion-item>
          <ion-item button @click="filtrarPor('Dulce')"><ion-label>Dulce</ion-label></ion-item>
          <ion-item button @click="filtrarPor('Desayuno')"><ion-label>Desayunos</ion-label></ion-item>
          <ion-item button @click="filtrarPor('Comida')"><ion-label>Comidas</ion-label></ion-item>
          <ion-item button @click="filtrarPor('Cena')"><ion-label>Cenas</ion-label></ion-item>
        </ion-list>
      </div>

      <div v-if="showUserMenu" class="custom-dropdown-content">
        <ion-list lines="full">
          <ion-item button @click="navegarA('/profile')"><ion-label>Mi Perfil</ion-label></ion-item>
          <ion-item button @click="navegarA('/comments')"><ion-label>Mis Comentarios</ion-label></ion-item>
          <ion-item button @click="handleLogout" lines="none"><ion-label color="dark" class="logout-label">Cerrar Sesión</ion-label></ion-item>
        </ion-list>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores/main';
import { 
  IonHeader, IonToolbar, IonButtons, IonButton, 
  IonIcon, IonSearchbar, IonList, IonItem, IonLabel, IonItemDivider 
} from '@ionic/vue';
import { 
  searchOutline, personOutline, 
  menuOutline, createOutline
} from 'ionicons/icons';

const router = useRouter();
const store = useMainStore();

const textoBusqueda = ref('');
const mostrarBusqueda = ref(false);
const mostrarFiltros = ref(false);
const showUserMenu = ref(false);
const showAdminMenu = ref(false);

const cerrarTodo = () => {
  mostrarBusqueda.value = false;
  mostrarFiltros.value = false;
  showUserMenu.value = false;
  showAdminMenu.value = false;
};

const toggleBusqueda = () => {
  const antes = mostrarBusqueda.value;
  cerrarTodo();
  mostrarBusqueda.value = !antes;
};

const toggleAdminMenu = () => {
  const antes = showAdminMenu.value;
  cerrarTodo();
  showAdminMenu.value = !antes;
};

const toggleUserMenu = () => {
  const antes = showUserMenu.value;
  cerrarTodo();
  showUserMenu.value = !antes;
};

const toggleFiltros = () => {
  const antes = mostrarFiltros.value;
  cerrarTodo();
  mostrarFiltros.value = !antes;
};

const realizarBusqueda = () => {
  router.push({ path: '/home', query: { search: textoBusqueda.value } });
};

const limpiarBusqueda = () => {
  textoBusqueda.value = '';
  router.push('/home');
};

const filtrarPor = (categoria: string) => {
  cerrarTodo();
  
  if (!categoria) {
    router.push('/home');
  } else if (categoria === 'guardados') {
    router.push({ path: '/home', query: { filter: 'guardados' } });
  } else {
    router.push({ path: '/home', query: { category: categoria } });
  }
};

const navegarA = (ruta: string) => {
  cerrarTodo();
  router.push(ruta);
};

const handleLogout = () => {
  store.logout();
  cerrarTodo();
  router.push('/home');
};
</script>

<style scoped>
.header-toolbar {
  --background: #d2694c;
  --color: #000000;
  border-bottom: 1px solid #c9a66b;
}

.custom-dropdown {
  position: relative; 
  width: 100%;
  z-index: 1000;
  border-bottom: 2px solid #c9a66b;
  background-color: #d2694c;
}

.custom-dropdown ion-list {
  background: #d2694c !important;
  --background: #d2694c;
  margin: 0;
  padding: 0;
}

.custom-dropdown ion-item {
  --background: #d2694c;
  --color: #000000;
  --padding-start: 16px;
  font-family: "Itim", sans-serif;
}

.dropdown-divider {
  --background: #c9a66b;
  --color: #000000;
  font-weight: bold;
}

ion-searchbar {
  --color: #000000 !important;
  --placeholder-color: #444444;
  --icon-color: #000000;
  --clear-button-color: #000000;
}

.dropdown-toolbar {
  --background: #d2694c;
  --min-height: 0;
  padding: 0;
  margin: 0;
  border-bottom: 2px solid #c9a66b;
}

.custom-dropdown-content {
  position: relative; 
  width: 100%;
  background-color: #d2694c;
}

ion-toolbar {
  transition: all 0.3s ease-in-out;
}
</style>