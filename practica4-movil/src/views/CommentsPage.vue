<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/profile" />
        </ion-buttons>
        <ion-title>Mis Comentarios</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="main-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title class="ion-text-center">Historial de Comentarios</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <div v-if="store.myCommentsLoading" class="ion-text-center ion-padding">
              <p>Cargando tus comentarios...</p>
            </div>

            <div v-else-if="!hasComments" class="empty-state-container">
              <ion-icon :icon="chatbubbleOutline" class="empty-state-icon"></ion-icon>
              <p class="ion-text-center empty-state-text">Aún no has dejado ningún comentario.</p>
              <ion-button fill="clear" router-link="/home" class="legal-link-btn ion-text-center">
                Ve a una receta y deja el primero 😊
              </ion-button>
            </div>

            <div v-else>
              <article v-for="comment in paginatedComments" :key="comment.id" class="comment-item">
                <div class="recipe-header">
                  <ion-thumbnail slot="start">
                    <img :src="comment.receta?.imagenUrl || '/placeholder.jpg'" @error="$event.target.src = '/placeholder.jpg'" />
                  </ion-thumbnail>
                  <div class="recipe-meta">
                    <router-link :to="`/recipe/${comment.receta?.id}`" class="recipe-link">
                      {{ comment.receta?.titulo || 'Receta eliminada' }}
                    </router-link>
                    <span class="date-text">{{ formatDate(comment.created) }}</span>
                  </div>
                </div>

                <div class="comment-body">
                  <div v-if="editingId !== comment.id">
                    <p class="comment-text">"{{ comment.texto }}"</p>
                    <div class="rating-display">
                      <ion-icon v-for="i in 5" :key="i" 
                                :icon="i <= comment.rating ? star : starOutline" 
                                :color="i <= comment.rating ? 'warning' : 'medium'">
                      </ion-icon>
                    </div>
                    <div class="action-buttons">
                      <ion-button size="small" fill="clear" color="primary" @click="startEdit(comment)">
                        <ion-icon slot="start" :icon="createOutline"></ion-icon> Editar
                      </ion-button>
                      <ion-button size="small" fill="clear" color="danger" @click="handleDelete(comment.id)">
                        <ion-icon slot="start" :icon="trashOutline"></ion-icon> Eliminar
                      </ion-button>
                    </div>
                  </div>

                  <div v-else class="edit-mode">
                    <ion-textarea
                      v-model="editTexto"
                      rows="3"
                      class="custom-textarea"
                      placeholder="Escribe tu comentario..."
                    ></ion-textarea>
                    
                    <div class="rating-selector">
                      <ion-button v-for="starIndex in 5" :key="starIndex" fill="clear" size="small" @click="editRating = starIndex">
                        <ion-icon :icon="starIndex <= editRating ? star : starOutline" 
                                  :color="starIndex <= editRating ? 'warning' : 'medium'">
                        </ion-icon>
                      </ion-button>
                    </div>

                    <div class="edit-actions">
                      <ion-button size="small" color="medium" @click="cancelEdit">Cancelar</ion-button>
                      <ion-button size="small" color="dark" @click="saveEdit">Guardar</ion-button>
                    </div>
                  </div>
                </div>
              </article>

              <div class="pagination-footer ion-margin-top">
                <ion-button fill="clear" :disabled="currentPage === 1" @click="setPage(currentPage - 1)">
                  <ion-icon :icon="chevronBackOutline"></ion-icon>
                </ion-button>
                <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
                <ion-button fill="clear" :disabled="currentPage === totalPages" @click="setPage(currentPage + 1)">
                  <ion-icon :icon="chevronForwardOutline"></ion-icon>
                </ion-button>
              </div>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonThumbnail, IonLabel, IonText, IonButton, 
  IonIcon, IonTextarea, alertController, IonFooter
} from '@ionic/vue'
import { 
  star, starOutline, createOutline, trashOutline, 
  chevronBackOutline, chevronForwardOutline, chatbubbleOutline 
} from 'ionicons/icons'

import '../theme/comments.css'

const router = useRouter()
const store = useMainStore()

// Edición
const editingId = ref(null)
const editTexto = ref('')
const editRating = ref(5)

// Paginación
const currentPage = ref(1)
const pageSize = 4

onMounted(async () => {
    if (!store.isLogged) {
        router.push('/login')
        return
    }
    try {
        await store.loadMyComments()
    } catch (err) {}
})

const hasComments = computed(() => store.myComments.length > 0)
const totalPages = computed(() => Math.max(1, Math.ceil(store.myComments.length / pageSize)))

const paginatedComments = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return store.myComments.slice(start, start + pageSize)
})

const setPage = (page) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
}

const startEdit = (comment) => {
    editingId.value = comment.id
    editTexto.value = comment.texto || ''
    editRating.value = comment.rating != null ? comment.rating : 5
}

const cancelEdit = () => {
    editingId.value = null
    editTexto.value = ''
    editRating.value = 5
}

const saveEdit = async () => {
    if (!editingId.value) return
    if (!editTexto.value.trim()) {
        const alert = await alertController.create({
            header: 'Error',
            message: 'El comentario no puede estar vacío.',
            buttons: ['OK']
        })
        await alert.present()
        return
    }

    try {
        await store.updateMyComment(editingId.value, {
            texto: editTexto.value.trim(),
            rating: editRating.value,
        })
        cancelEdit()
    } catch (err) {
        console.error(err)
    }
}

const handleDelete = async (id) => {
    const alert = await alertController.create({
        header: '¿Eliminar comentario?',
        message: 'Esta acción no se puede deshacer.',
        cssClass: 'custom-alert', 
        buttons: [
            { 
                text: 'CANCELAR', 
                role: 'cancel',
                cssClass: 'alert-button-cancel'
            },
            { 
                text: 'ELIMINAR', 
                role: 'destructive',
                handler: async () => {
                    await store.deleteMyComment(id)
                    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
                }
            }
        ]
    })
    await alert.present()
}

const formatDate = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>
