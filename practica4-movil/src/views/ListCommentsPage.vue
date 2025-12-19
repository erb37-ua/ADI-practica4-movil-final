<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" />
        </ion-buttons>
        <ion-title>Administrar Comentarios</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="list-container">
        <div class="list-header-controls">
          <ion-searchbar 
            class="list-search-bar" 
            placeholder="Buscar usuario o comentario" 
            v-model="searchQuery"
            @ionInput="currentPage = 1"
          ></ion-searchbar>
        </div>

        <ion-list class="custom-list" lines="none">
          <div v-if="store.allCommentsLoading" class="ion-text-center ion-padding">
            <ion-spinner name="crescent"></ion-spinner>
            <p>Cargando todos los comentarios...</p>
          </div>

          <ion-item v-for="comment in paginatedComments" :key="comment.id" class="recipe-admin-card">
            <ion-thumbnail slot="start">
              <img :src="comment.receta?.imagenUrl || '/placeholder.jpg'" />
            </ion-thumbnail>
            
            <ion-label>
              <h2 class="recipe-admin-title">{{ comment.usuarioNombre }}</h2>

              <div class="rating-display" style="margin: 4px 0;">
              <ion-icon v-for="i in 5" :key="i" 
                        :icon="i <= comment.rating ? star : starOutline" 
                        :color="i <= comment.rating ? 'warning' : 'medium'"
                        style="font-size: 14px;">
              </ion-icon>
            </div>

            <p class="comment-text" style="font-style: italic; color: #444;">"{{ comment.texto }}"</p>
            </ion-label>

            <ion-buttons slot="end">
              <ion-button @click="handleDelete(comment.id)">
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
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, 
  IonBackButton, IonList, IonItem, IonThumbnail, IonLabel, 
  IonButton, IonIcon, IonSearchbar, alertController, IonSpinner 
} from '@ionic/vue'
import { 
  star, starOutline, trashOutline, chevronBackOutline, 
  chevronForwardOutline 
} from 'ionicons/icons'
import '../theme/list.css'

const router = useRouter()
const store = useMainStore()

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 6

onMounted(async () => {
    if (!store.isAdmin) {
        router.push('/home')
        return
    }
    await store.loadAllComments()
})

const filteredComments = computed(() => {
    let comments = store.allComments || []
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        comments = comments.filter((c: any) => 
            c.texto.toLowerCase().includes(query) || 
            c.usuarioNombre.toLowerCase().includes(query) 
        )
    }
    return comments
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredComments.value.length / pageSize)))
const paginatedComments = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredComments.value.slice(start, start + pageSize)
})

const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

const handleDelete = async (id: string) => {
    const alert = await alertController.create({
        header: '¿Eliminar comentario?',
        message: 'Acción administrativa: Se eliminará permanentemente.',
        cssClass: 'custom-alert', 
        buttons: [
            { text: 'CANCELAR', role: 'cancel', cssClass: 'alert-button-cancel' },
            { 
                text: 'ELIMINAR', 
                role: 'destructive',
                handler: async () => {
                    await store.deleteAnyComment(id)
                    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
                }
            }
        ]
    })
    await alert.present()
}

const formatDate = (iso: string) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
    .list-container {
    margin-top: 0 !important;
    padding-top: 0 !important;
    }

    ion-content {
    --padding-top: 0px !important;
    }

    .list-header-controls {
    margin-top: 10px;
    margin-bottom: 10px;
    }

    .list-search-bar {
    margin-bottom: 0;
    }
</style>