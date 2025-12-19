<template>
  <ion-page>
    <ion-content>
      <div class="profile-wrapper">
        <ion-card class="green-card" :class="{ 'profile-card--shake': shakeForm }">
          <ion-card-header>
            <ion-card-title class="main-title"><strong>Perfil</strong></ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <form @submit.prevent="handleSave">
              
              <div class="field-container">
                <ion-label class="custom-label">Nombre</ion-label>
                <div class="custom-input-box">
                  <ion-icon :icon="personOutline" class="input-icon"></ion-icon>
                  <ion-input 
                    v-model="nombre" 
                    type="text" 
                    placeholder="Tu nombre" 
                    required
                    class="inner-input"
                  ></ion-input>
                </div>
              </div>

              <div class="field-container">
                <ion-label class="custom-label">Correo electrónico</ion-label>
                <div class="custom-input-box disabled">
                  <ion-icon :icon="mailOutline" class="input-icon"></ion-icon>
                  <ion-input 
                    :value="correo" 
                    readonly
                    class="inner-input"
                  ></ion-input>
                </div>
              </div>

              <div class="field-container" :class="{ 'error-border': currentPassError }">
                <ion-label class="custom-label">Contraseña actual</ion-label>
                <div class="custom-input-box">
                  <ion-icon :icon="lockClosedOutline" class="input-icon"></ion-icon>
                  <ion-input 
                    v-model="passOld" 
                    type="password" 
                    placeholder="Contraseña actual" 
                    class="inner-input"
                  ></ion-input>
                </div>
              </div>

              <div class="field-container" :class="{ 'error-border': passwordError }">
                <ion-label class="custom-label">Contraseña</ion-label>
                <div class="custom-input-box">
                  <ion-icon :icon="lockClosedOutline" class="input-icon"></ion-icon>
                  <ion-input 
                    v-model="pass" 
                    type="password" 
                    placeholder="********" 
                    class="inner-input"
                  ></ion-input>
                </div>
              </div>

              <div class="field-container" :class="{ 'error-border': passwordError }">
                <ion-label class="custom-label">Repetir contraseña</ion-label>
                <div class="custom-input-box">
                  <ion-icon :icon="lockClosedOutline" class="input-icon"></ion-icon>
                  <ion-input 
                    v-model="pass2" 
                    type="password" 
                    placeholder="********************" 
                    class="inner-input"
                  ></ion-input>
                </div>
              </div>

              <div class="message-zone">
                <transition name="fade-slide">
                  <div v-if="errorMsg || infoMsg">
                    <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
                    <p v-if="infoMsg" class="info-msg">{{ infoMsg }}</p>
                  </div>
                </transition>
              </div>

              <div class="action-buttons">
                <ion-button type="submit" class="btn-dark" :disabled="cargando">
                  {{ cargando ? 'Guardando...' : 'Guardar cambios' }}
                </ion-button>
                <ion-button type="button" class="btn-dark" @click="handleLogout">
                  Cerrar sesión
                </ion-button>
              </div>

              <div class="delete-container">
                <ion-button type="button" class="btn-danger" @click="confirmDelete">
                  Eliminar cuenta
                </ion-button>
              </div>

            </form>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { 
    IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, 
    IonCardContent, IonLabel, IonInput, IonButton, IonIcon, 
    alertController, onIonViewWillEnter 
    } from '@ionic/vue'
import { personOutline, mailOutline, lockClosedOutline } from 'ionicons/icons'

import '../theme/profile.css';

const router = useRouter()
const store = useMainStore()

const nombre = ref('')
const correo = ref('')
const passOld = ref('')
const pass = ref('')
const pass2 = ref('')
const errorMsg = ref('')
const infoMsg = ref('')
const shakeForm = ref(false)
const passwordError = ref(false)
const currentPassError = ref(false)

const cargando = computed(() => store.authLoading)

const triggerShake = async () => {
    shakeForm.value = false
    await nextTick()
    shakeForm.value = true
    setTimeout(() => { shakeForm.value = false }, 400)
}

const loadUserData = () => {
    if (!store.isLogged) {
        router.push('/login')
        return
    }
    const user = store.user
    nombre.value = user?.name || ''
    correo.value = user?.email || ''
}

onMounted(loadUserData)
onIonViewWillEnter(loadUserData)

const handleSave = async () => {
    if (pass.value && pass.value !== pass2.value) {
        errorMsg.value = 'Las contraseñas no coinciden.'
        infoMsg.value = ''
        passwordError.value = true
        currentPassError.value = false
        await triggerShake()
        return
    }

    errorMsg.value = ''; infoMsg.value = '';
    passwordError.value = false; currentPassError.value = false;

    try {
        await store.updateProfile({
            name: nombre.value,
            email: correo.value,
            password: pass.value || undefined,
            passwordConfirm: pass2.value || undefined,
            oldPassword: passOld.value || undefined,
        })

        infoMsg.value = 'Perfil actualizado correctamente.'
        pass.value = ''; pass2.value = ''; passOld.value = '';
    } catch (error) {
        errorMsg.value = error.message || 'No se pudo actualizar el perfil.'
        const msg = errorMsg.value.toLowerCase()
        if (msg.includes('contraseña actual') || msg.includes('current password')) {
            currentPassError.value = true
        }
        await triggerShake()
    }
}

const handleLogout = () => {
    store.logout()
    router.push('/login')
}

const confirmDelete = async () => {
    const alert = await alertController.create({
        header: '¿Eliminar cuenta?',
        message: '¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
        cssClass: 'custom-alert',
        buttons: [
            { text: 'Cancelar', role: 'cancel' },
            {
                text: 'Eliminar',
                role: 'destructive',
                handler: async () => {
                    try {
                        await store.deleteAccount()
                        router.push('/')
                    } catch (error) {
                        errorMsg.value = error.message || 'No se pudo eliminar la cuenta.'
                        await triggerShake()
                    }
                }
            }
        ]
    })
    await alert.present()
}
</script>