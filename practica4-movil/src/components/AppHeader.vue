<template>
  <ion-header>
    <ion-toolbar class="header-toolbar">
      <ion-buttons slot="start">
        <ion-button @click="router.push('/')">
          <img src="/logo.png" alt="Logo" style="width: 40px; height: 40px;" />
        </ion-button>
      </ion-buttons>

      <ion-title class="header-title">Recetario</ion-title>

      <ion-buttons slot="end">
        <ion-button @click="mostrarBusqueda = !mostrarBusqueda">
          <ion-icon slot="icon-only" :icon="searchOutline"></ion-icon>
        </ion-button>

        <ion-button v-if="store.isLogged" @click="toggleUserMenu">
          <ion-icon slot="icon-only" :icon="personCircleOutline"></ion-icon>
        </ion-button>
        <ion-button v-else @click="router.push('/login')">
          <ion-icon slot="icon-only" :icon="personOutline"></ion-icon>
        </ion-button>

        <ion-button @click="mostrarFiltros = !mostrarFiltros">
          <ion-icon slot="icon-only" :icon="optionsOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>

    <ion-toolbar v-if="mostrarBusqueda" class="header-toolbar">
      <ion-searchbar
        v-model="textoBusqueda"
        placeholder="Buscar receta..."
        @keyup.enter="realizarBusqueda"
        @ionClear="limpiarBusqueda"
        animated
      ></ion-searchbar>
    </ion-toolbar>

    <div v-if="mostrarFiltros" class="custom-dropdown">
      <ion-list lines="full">
        <ion-item button @click="filtrarPor('guardados')">
          <ion-label>Recetas Guardadas ❤️</ion-label>
        </ion-item>
        <ion-item-divider class="dropdown-divider">
          <ion-label>CATEGORÍAS</ion-label>
        </ion-item-divider>
        <ion-item button @click="filtrarPor('Salado')"><ion-label>Salado</ion-label></ion-item>
        <ion-item button @click="filtrarPor('Dulce')"><ion-label>Dulce</ion-label></ion-item>
        <ion-item button @click="filtrarPor('Desayuno')"><ion-label>Desayunos</ion-label></ion-item>
        <ion-item button @click="filtrarPor('Comida')"><ion-label>Comidas</ion-label></ion-item>
        <ion-item button @click="filtrarPor('Cena')"><ion-label>Cenas</ion-label></ion-item>
      </ion-list>
    </div>

    <div v-if="showUserMenu" class="custom-dropdown">
      <ion-list lines="full">
        <ion-item button @click="navegarA('/profile')">
          <ion-label>Mi Perfil</ion-label>
        </ion-item>
        <ion-item button @click="navegarA('/comments')">
          <ion-label>Mis Comentarios</ion-label>
        </ion-item>
        <ion-item button @click="handleLogout" lines="none">
          <ion-label color="dark" class="logout-label">Cerrar Sesión</ion-label>
        </ion-item>
      </ion-list>
    </div>
  </ion-header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores/main';
import { 
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, 
  IonIcon, IonSearchbar, IonList, IonItem, IonLabel, IonItemDivider 
} from '@ionic/vue';
import { 
  searchOutline, personCircleOutline, personOutline, 
  optionsOutline, logOutOutline 
} from 'ionicons/icons';

const router = useRouter();
const store = useMainStore();

const textoBusqueda = ref('');
const mostrarBusqueda = ref(false);
const mostrarFiltros = ref(false);
const showUserMenu = ref(false);

const realizarBusqueda = () => {
  router.push({ path: '/home', query: { search: textoBusqueda.value } });
};

const limpiarBusqueda = () => {
  textoBusqueda.value = '';
  router.push('/home');
};

const filtrarPor = (categoria: string) => {
  mostrarFiltros.value = false;
  if (categoria === 'guardados') {
    router.push({ path: '/home', query: { filter: 'guardados' } });
  } else {
    router.push({ path: '/home', query: { category: categoria } });
  }
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  mostrarFiltros.value = false; // cerrar otros si se abre este
};

const navegarA = (ruta: string) => {
  showUserMenu.value = false;
  router.push(ruta);
};

const handleLogout = () => {
  store.logout();
  showUserMenu.value = false;
  router.push('/home');
};
</script>

<style scoped>
/* Estilos para el Toolbar Principal */
.header-toolbar {
  --background: #d2694c; /* Tono rojo original  */
  --color: #000000;
  border-bottom: 1px solid #c9a66b;
}

.header-title {
  font-family: "Itim", sans-serif;
  font-weight: bold;
}

/* Contenedor de los desplegables con fondo rojo */
.custom-dropdown {
  position: absolute;
  width: 100%;
  z-index: 1000;
  border-bottom: 2px solid #c9a66b;
  background-color: #d2694c;
}

/* Estilo de la lista dentro de los desplegables */
.custom-dropdown ion-list {
  background: #d2694c !important;
  --background: #d2694c; /* Fondo rojo para el menú  */
  margin: 0;
  padding: 0;
}

/* Estilo de los elementos individuales del menú */
.custom-dropdown ion-item {
  --background: #d2694c;
  --color: #000000;
  --padding-start: 16px;
  font-family: "Itim", sans-serif;
}

/* Efecto hover/click en los items */
.custom-dropdown ion-item::part(native):active {
  background: rgba(255, 255, 255, 0.2);
}

/* Divisores dentro del menú */
.dropdown-divider {
  --background: #c9a66b;
  --color: #000000;
  font-weight: bold;
}

.logout-label {
  font-weight: bold;
}
</style>