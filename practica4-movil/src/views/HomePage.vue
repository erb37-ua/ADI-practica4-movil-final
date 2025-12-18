<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Recetario Móvil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div v-if="store.homeLoading" class="message-container">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Cargando recetas...</p>
      </div>

      <div v-else-if="recetasFiltradas.length === 0" class="message-container">
        <p class="message-text">No se encontraron recetas 😢</p>
        <ion-button fill="clear" @click="limpiarFiltros">Ver todas</ion-button>
      </div>

      <div v-else class="recetas-grid">
        <article v-for="receta in recetasFiltradas" :key="receta.id" class="receta-card">
          <img 
            :src="receta.imagen || '/receta-ramen.jpg'" 
            class="receta-image" 
            @click="irAlDetalle(receta.id)"
          />

          <div class="receta-info">
            <h2 class="receta-title" @click="irAlDetalle(receta.id)">{{ receta.titulo }}</h2>
            
            <ion-button fill="clear" @click="handleLike(receta)">
              <ion-icon 
                slot="icon-only" 
                :icon="receta.liked ? heart : heartOutline" 
                :class="['heart-icon', { 'is-liked': receta.liked }]"
              ></ion-icon>
            </ion-button>
          </div>

          <div class="receta-footer">
            <p>{{ receta.comentarios }} comentarios</p>
          </div>
        </article>
      </div>

      <ion-fab v-if="store.isAdmin" slot="fixed" vertical="bottom" horizontal="end" class="fab-button">
        <ion-fab-button color="danger" @click="router.push('/create-edit')">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonIcon, IonButton, IonSpinner, IonFab, IonFabButton 
} from '@ionic/vue';
import { heart, heartOutline, add } from 'ionicons/icons';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMainStore } from '@/stores/main';

import '../theme/home.css';

const route = useRoute();
const router = useRouter();
const store = useMainStore();

onMounted(() => {
  store.loadHomeRecipes();
});

const recetasFiltradas = computed(() => {
  const recetas = store.homeRecipes;
  let resultado = recetas;

  if (route.query.search) {
    const busqueda = String(route.query.search).toLowerCase();
    resultado = resultado.filter((r: any) => r.titulo.toLowerCase().includes(busqueda));
  }

  if (route.query.category) {
    const cat = route.query.category;
    resultado = resultado.filter((r: any) => Array.isArray(r.categoria) ? r.categoria.includes(cat) : r.categoria === cat);
  }

  if (route.query.filter === 'guardados') {
    resultado = resultado.filter((r: any) => r.liked);
  }

  return resultado;
});

const handleLike = async (receta: any) => {
  try {
    await store.toggleLikeReceta(receta.id);
  } catch (error) {
    console.error('Error al dar like');
  }
};

const irAlDetalle = (id: string) => {
  router.push({ name: 'RecipeDetail', params: { id } });
};

const limpiarFiltros = () => {
  router.push('/home');
};
</script>