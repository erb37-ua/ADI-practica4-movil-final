<template>
  <ion-page>
    <ion-content>
      <div v-if="loading" class="ion-padding ion-text-center">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Cargando detalle...</p>
      </div>

      <main v-else-if="receta" class="recipe-detail-container">
        <h2 class="recipe-detail__title"><strong>{{ receta.titulo }}</strong></h2>

        <img 
          class="recipe-detail__image" 
          :src="receta.imagenUrl || '/placeholder.jpg'" 
          :alt="receta.titulo" 
          @error="(e: any) => e.target.src = '/placeholder.jpg'"
        />

        <p class="recipe-detail__description">{{ receta.descripcion }}</p>

        <h3 class="section-title"><strong>INGREDIENTES</strong></h3>
        <div class="recipe-detail__list">
          <div v-if="Array.isArray(receta.ingredientes) && receta.ingredientes.length > 0 && receta.ingredientes[0].section">
            <div v-for="(seccion, index) in receta.ingredientes" :key="index" class="ingredient-group">
              <h4 v-if="seccion.section" class="recipe-detail__subsection-title">{{ seccion.section }}</h4>
              <ul class="recipe-detail__list-items">
                <li v-for="(item, i) in seccion.items" :key="i">
                  <span v-if="item.amount" class="amount"><strong>{{ item.amount }}</strong></span>
                  {{ item.name }}
                </li>
              </ul>
            </div>
          </div>
          <ul v-else-if="Array.isArray(receta.ingredientes)" class="recipe-detail__list-items">
            <li v-for="(ing, index) in receta.ingredientes" :key="index">
              {{ ing }}
            </li>
          </ul>
          <p v-else class="no-data">No hay ingredientes especificados.</p>
        </div>

        <h3 class="section-title"><strong>PASOS</strong></h3>
        <div class="recipe-detail__steps">
          <ol>
            <li v-for="(step, index) in receta.pasos" :key="index" class="step-item">
              <span v-html="formatInstruction(step)"></span>
            </li>
          </ol>
        </div>

        <section class="recipe-comments">
          <h3 class="section-title"><strong>COMENTARIOS</strong></h3>
          
          <div class="comment-form">
            <div class="rating-container">
              <div class="stars-row">
                <ion-icon 
                  v-for="i in 5" 
                  :key="i"
                  :icon="i <= commentRating ? star : starOutline"
                  :class="{ 'star-active': i <= commentRating }"
                  @click="commentRating = i"
                ></ion-icon>
              </div>
            </div>
            
            <ion-item lines="none" class="custom-textarea-item">
              <ion-textarea 
                v-model="commentText" 
                placeholder="Escribe tu opinión aquí..." 
                rows="3"
              ></ion-textarea>
            </ion-item>
            
            <ion-button 
              :disabled="submittingComment" 
              @click="handleSubmitComment" 
              class="btn-enviar-comentario"
            >
              {{ submittingComment ? 'Enviando...' : 'Enviar' }}
            </ion-button>
          </div>

          <div v-for="comment in comments" :key="comment.id" class="recipe-comments__item">
            <p class="recipe-comments__author">{{ comment.usuario?.nombre || 'Anónimo' }}</p>
            <p class="recipe-comments__meta">{{ formatDate(comment.created) }}</p>
            <p class="recipe-comments__stars">{{ '⭐'.repeat(comment.rating) }}</p>
            <p class="comment-text">{{ comment.texto }}</p>
          </div>
        </section>
      </main>

      <ion-fab vertical="bottom" horizontal="start" slot="fixed">
        <ion-fab-button size="small" color="light" @click="router.back()">
          <ion-icon :icon="chevronBack"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { 
  IonPage, IonContent, IonSpinner, IonItem, IonLabel, 
  IonTextarea, IonButton, IonFab, IonFabButton, IonIcon 
} from '@ionic/vue'
import { chevronBack, star, starOutline } from 'ionicons/icons'
import '../theme/recipe-detail.css'

const route = useRoute()
const router = useRouter()
const store = useMainStore()

const receta = ref<any>(null)
const loading = ref(true)

const commentText = ref('')
const commentRating = ref(5)
const submittingComment = ref(false)

const comments = computed(() => store.recipeComments || [])

onMounted(async () => {
    const id = route.params.id as string
    try {
        receta.value = await store.fetchRecipeById(id)
        await store.loadCommentsForRecipe(id)
    } catch (error) {
        router.push('/home')
    } finally {
        loading.value = false
    }
})

const formatInstruction = (step: any) => {
    let text = "";
    if (typeof step === 'object' && step !== null) {
        text = step.instruction || "";
    } else {
        text = step || "";
    }
    if (typeof text !== 'string') return '';
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

const formatDate = (iso: string) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('es-ES')
}

const handleSubmitComment = async () => {
    if (!store.isLogged) {
        alert('Identifícate para comentar')
        router.push('/login')
        return
    }
    if (!commentText.value.trim()) return;

    submittingComment.value = true
    try {
        await store.createCommentForRecipe({
            recetaId: receta.value.id,
            texto: commentText.value.trim(),
            rating: commentRating.value,
        })
        commentText.value = ''
        commentRating.value = 5
    } finally {
        submittingComment.value = false
    }
}
</script>