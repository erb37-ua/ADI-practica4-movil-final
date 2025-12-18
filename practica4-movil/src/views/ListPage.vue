<template>
  <ion-page>
    <ion-content>
      <div class="list-container">
        
        <div class="list-header-controls">
            <ion-item lines="none" class="filter-select-item">
                <ion-select 
                    :value="filterCategory" 
                    @ionChange="changeFilter($event)" 
                    interface="popover" 
                    toggle-icon="chevron-down"
                    placeholder="Todo"
                >
                <ion-select-option value="">Todo</ion-select-option>
                <ion-select-option value="Desayuno">Desayuno</ion-select-option>
                <ion-select-option value="Comida">Comida</ion-select-option>
                <ion-select-option value="Cena">Cena</ion-select-option>
                <ion-select-option value="Salado">Salado</ion-select-option>
                <ion-select-option value="Dulce">Dulce</ion-select-option>
                </ion-select>
            </ion-item>

            <ion-searchbar 
                class="list-search-bar" 
                placeholder="Buscar" 
                v-model="searchQuery"
                @ionInput="handleSearch"
            ></ion-searchbar>
        </div>

        <ion-list class="custom-list">
          <ion-item v-for="recipe in paginatedRecipes" :key="recipe.id" class="recipe-admin-card" lines="none">
            <ion-thumbnail slot="start">
              <img :src="recipe.image || '/placeholder.jpg'" class="recipe-admin-thumb" />
            </ion-thumbnail>
            
            <ion-label>
              <h2 class="recipe-admin-title">{{ recipe.title }}</h2>
            </ion-label>

            <ion-buttons slot="end">
              <ion-button @click="handleEdit(recipe.id)">
                <ion-icon slot="icon-only" :icon="createOutline" color="primary"></ion-icon>
              </ion-button>
              <ion-button @click="handleDelete(recipe.id)">
                <ion-icon slot="icon-only" :icon="trashOutline" color="danger"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-item>
        </ion-list>

        <div v-if="totalPages > 1" class="pagination-footer">
          <ion-button fill="clear" :disabled="currentPage === 1" @click="setPage(currentPage - 1)">
            <ion-icon :icon="chevronBackOutline" class="pagination-icon"></ion-icon>
          </ion-button>
          <span class="page-number">{{ currentPage }} / {{ totalPages }}</span>
          <ion-button fill="clear" :disabled="currentPage === totalPages" @click="setPage(currentPage + 1)">
            <ion-icon :icon="chevronForwardOutline" class="pagination-icon"></ion-icon>
          </ion-button>
        </div>
      </div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed" class="fab-add">
        <ion-fab-button @click="router.push('/create-edit')">
          <ion-icon :icon="addOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { 
  IonPage, IonContent, IonList, IonItem, IonLabel, IonThumbnail, 
  IonButton, IonIcon, IonButtons, IonSearchbar, IonSelect, 
  IonSelectOption, IonSpinner 
} from '@ionic/vue'
import { 
  createOutline, trashOutline, chevronBackOutline, 
  chevronForwardOutline, addOutline
} from 'ionicons/icons'
import '../theme/list.css'

const router = useRouter()
const store = useMainStore()

const filterCategory = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 6

onMounted(() => {
  store.loadRecipes()
})

const filteredRecipes = computed(() => {
  let recipes = store.recipes
  if (filterCategory.value) {
    recipes = recipes.filter((r: any) => r.category.includes(filterCategory.value))
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    recipes = recipes.filter((r: any) => r.title.toLowerCase().includes(query))
  }
  return recipes
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRecipes.value.length / pageSize)))
const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRecipes.value.slice(start, start + pageSize)
})

const changeFilter = (ev: any) => {
  filterCategory.value = ev.detail.value
  currentPage.value = 1
}
const handleSearch = () => { currentPage.value = 1 }
const setPage = (page: number) => { if (page >= 1 && page <= totalPages.value) currentPage.value = page }

const handleDelete = async (id: string) => {
  if (!confirm('¿Eliminar esta receta?')) return
  try {
    await store.deleteRecipe(id)
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  } catch (error) {
    alert('No se pudo eliminar.')
  }
}
const handleEdit = (id: string) => { router.push(`/create-edit/${id}`) }
</script>