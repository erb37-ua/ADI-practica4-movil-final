<template>
  <ion-page>
    <ion-content class="ion-page-white">
      <div class="create-edit-container">
        <h2 class="main-title ion-text-center">
          <strong>{{ isEditMode ? 'Editar Receta' : 'Nueva Receta' }}</strong>
        </h2>

        <div class="image-upload-wrapper">
            <img :src="imagenPreview" class="preview-img" :class="{ 'error-border': invalidImage }" />
            <input type="file" id="imgInput" accept="image/*" @change="handleImagenChange" style="display: none" />
            
            <div class="center-button-container">
                <ion-button class="btn-add-image" @click="triggerImageInput">
                    <ion-icon slot="start" :icon="cameraOutline"></ion-icon>
                    {{ isDefaultImage ? 'AÑADIR IMAGEN' : 'CAMBIAR IMAGEN' }}
                </ion-button>
            </div>
        </div>

        <ion-list lines="none">
          <ion-item class="custom-input-item">
            <ion-label position="stacked">Título de la receta</ion-label>
            <ion-input v-model="titulo" placeholder="Ej: Pizza Napolitana" :class="{ 'error-border': invalidTitle }"></ion-input>
          </ion-item>

          <ion-item class="custom-input-item">
            <ion-label position="stacked">Descripción breve</ion-label>
            <ion-textarea v-model="descripcion" placeholder="Cuenta algo sobre esta receta..." rows="3"></ion-textarea>
          </ion-item>

          <ion-item class="custom-input-item">
            <ion-label position="stacked">Añadir Categoría</ion-label>
            <ion-select @ionChange="handleCategoriaAdd($event)" placeholder="Selecciona" interface="popover">
              <ion-select-option value="Desayuno">Desayuno</ion-select-option>
              <ion-select-option value="Comida">Comida</ion-select-option>
              <ion-select-option value="Cena">Cena</ion-select-option>
              <ion-select-option value="Salado">Salado</ion-select-option>
              <ion-select-option value="Dulce">Dulce</ion-select-option>
            </ion-select>
          </ion-item>
          
          <div class="tag-container ion-padding-horizontal">
            <ion-chip v-for="cat in categoriasSeleccionadas" :key="cat" class="category-tag" @click="removeCategoria(cat)">
              <ion-label>{{ cat }}</ion-label>
              <ion-icon :icon="closeCircle"></ion-icon>
            </ion-chip>
          </div>

          <div class="section-container">
            <h3 class="section-subtitle">INGREDIENTES</h3>
            <div v-for="(section, sIndex) in ingredientes" :key="sIndex" class="bordered-card">
              <div class="card-header">
                <ion-input v-model="section.section" placeholder="Nombre de sección (ej. Salsa)" class="bold-input"></ion-input>
                <ion-button fill="clear" color="danger" @click="removeIngredientSection(sIndex)" v-if="ingredientes.length > 1">
                  <ion-icon :icon="trashOutline"></ion-icon>
                </ion-button>
              </div>

              <div v-for="(item, iIndex) in section.items" :key="iIndex" class="item-row">
                <ion-input v-model="item.amount" placeholder="Cant." class="input-qty"></ion-input>
                <ion-input v-model="item.name" placeholder="Ingrediente" class="input-name"></ion-input>
                <ion-button fill="clear" color="medium" @click="removeIngredientItem(sIndex, iIndex)">
                  <ion-icon :icon="removeCircleOutline"></ion-icon>
                </ion-button>
              </div>
              
              <ion-button fill="clear" size="small" @click="addIngredientItem(sIndex)">
                <ion-icon slot="start" :icon="addCircleOutline"></ion-icon>
                Añadir ingrediente
              </ion-button>
            </div>
            <ion-button expand="block" fill="outline" @click="addIngredientSection" class="ion-margin-top">
              <strong>+ AÑADIR SECCIÓN</strong>
            </ion-button>
          </div>

          <div class="section-container">
            <h3 class="section-subtitle">PASOS DE PREPARACIÓN</h3>
            <div class="bordered-card">
              <div v-for="(step, index) in pasos" :key="index" class="step-row">
                <ion-badge color="dark">{{ index + 1 }}</ion-badge>
                <ion-textarea v-model="step.instruction" auto-grow placeholder="Describe el paso..."></ion-textarea>
                <ion-button fill="clear" color="danger" @click="removeStep(index)">
                  <ion-icon :icon="closeOutline"></ion-icon>
                </ion-button>
              </div>
              <ion-button expand="block" fill="clear" @click="addStep">
                <ion-icon slot="start" :icon="addOutline"></ion-icon>
                Añadir Paso
              </ion-button>
            </div>
          </div>
        </ion-list>

        <div class="form-footer">
            <ion-button expand="block" class="btn-footer-cancel" @click="router.back()">
                Cancelar
            </ion-button>
            <ion-button expand="block" class="btn-primary-red" @click="handleSubmit">
                {{ isEditMode ? 'Guardar' : 'Crear' }}
            </ion-button>
        </div>
      </div>

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
  IonPage, IonContent, IonList, IonItem, IonLabel, 
  IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton, 
  IonIcon, IonChip, IonBadge, IonFab, IonFabButton, alertController
} from '@ionic/vue'
import { 
  cameraOutline, closeCircle, addOutline, trashOutline, 
  addCircleOutline, removeCircleOutline, closeOutline, chevronBack
} from 'ionicons/icons'

import '../theme/create-edit.css'

const router = useRouter()
const route = useRoute()
const store = useMainStore()

const titulo = ref('')
const descripcion = ref('')
const categoriasSeleccionadas = ref<string[]>([])
const imagenPreview = ref('/subir.png')
const imagenFile = ref<File | null>(null)
const isDefaultImage = ref(true)
const isShaking = ref(false)

const invalidTitle = ref(false)
const invalidCategory = ref(false)
const invalidImage = ref(false)

const ingredientes = ref([
  { section: 'Ingredientes Principales', items: [{ amount: '', name: '' }] }
])
const pasos = ref([{ number: 1, instruction: '' }])

const isEditMode = computed(() => !!route.params.id)
const recipeId = route.params.id as string

const triggerImageInput = () => {
  const input = document.getElementById('imgInput') as HTMLInputElement;
  if (input) input.click();
};

onMounted(async () => {
  if (isEditMode.value) {
    try {
      const receta = await store.fetchRecipeById(recipeId)
      titulo.value = receta.titulo
      descripcion.value = receta.descripcion
      categoriasSeleccionadas.value = Array.isArray(receta.categoria) ? receta.categoria : []
      if (receta.ingredientes?.length) ingredientes.value = receta.ingredientes
      if (receta.pasos?.length) pasos.value = receta.pasos
      if (receta.imagenUrl) {
        imagenPreview.value = receta.imagenUrl
        isDefaultImage.value = false
      }
    } catch (e) {
      router.push('/list')
    }
  }
})

const addIngredientSection = () => ingredientes.value.push({ section: '', items: [{ amount: '', name: '' }] })
const removeIngredientSection = (i: number) => ingredientes.value.splice(i, 1)
const addIngredientItem = (si: number) => ingredientes.value[si].items.push({ amount: '', name: '' })
const removeIngredientItem = (si: number, ii: number) => ingredientes.value[si].items.splice(ii, 1)
const addStep = () => pasos.value.push({ number: pasos.value.length + 1, instruction: '' })
const removeStep = (i: number) => pasos.value.splice(i, 1)

const handleImagenChange = (ev: any) => {
  const file = ev.target.files?.[0]
  if (!file) return
  imagenFile.value = file
  isDefaultImage.value = false
  const reader = new FileReader()
  reader.onload = (e) => (imagenPreview.value = e.target?.result as string)
  reader.readAsDataURL(file)
}

const handleCategoriaAdd = (ev: any) => {
  const val = ev.detail.value
  if (val && !categoriasSeleccionadas.value.includes(val)) {
    categoriasSeleccionadas.value.push(val)
  }
}

const removeCategoria = (cat: string) => {
  categoriasSeleccionadas.value = categoriasSeleccionadas.value.filter(c => c !== cat)
}

const handleSubmit = async () => {
  invalidTitle.value = !titulo.value.trim();
  invalidCategory.value = categoriasSeleccionadas.value.length === 0;
  invalidImage.value = isDefaultImage.value;

  if (invalidTitle.value || invalidCategory.value || invalidImage.value) {
    isShaking.value = true;
    setTimeout(() => isShaking.value = false, 500);

    const alertError = await alertController.create({
      header: 'Atención',
      message: 'Faltan campos obligatorios: Imagen, Título, 1 Categoría',
      cssClass: 'custom-alert',
      buttons: ['OK']
    });
    await alertError.present();
    return;
  }

  const formData = new FormData();
  formData.append('titulo', titulo.value);
  formData.append('descripcion', descripcion.value);
  formData.append('ingredientes', JSON.stringify(ingredientes.value));
  formData.append('pasos', JSON.stringify(pasos.value));

  if (imagenFile.value) {
    formData.append('imagen', imagenFile.value);
  }

  categoriasSeleccionadas.value.forEach(cat => {
    formData.append('categoria', cat);
  });

  try {
    if (isEditMode.value) {
      await store.updateRecipe(recipeId, formData);
    } else {
      await store.createRecipe(formData);
    }

    const alertSuccess = await alertController.create({
      header: '¡Hecho!',
      message: isEditMode.value ? '¡Receta actualizada con éxito!' : 'Receta creada con éxito',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'ACEPTAR',
          handler: () => {
            router.push('/list');
          }
        }
      ]
    });
    await alertSuccess.present();

    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }
  } catch (e: any) {
    console.error("ERROR DETALLADO:", e);
    
    const serverErrors = e.response?.data || e.data || {};
    const alertTechError = await alertController.create({
      header: 'Error del servidor',
      message: 'Hubo un problema al guardar la receta. Revisa los datos.',
      cssClass: 'custom-alert',
      buttons: ['OK']
    });
    await alertTechError.present();
  }
}
</script>