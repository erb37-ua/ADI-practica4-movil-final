<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/login" />
        </ion-buttons>
        <ion-title><strong>Registro</strong></ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="login-center-wrapper">
        <ion-card class="login-card green-card" :class="{ 'login-card--shake': shakeCard }">
          <ion-card-content>
            <h2 class="login-card__title"><strong>Crear cuenta</strong></h2>

            <form @submit.prevent="handleRegister">
              <div class="input-group" :class="{ 'input-group--error': errors.name }">
                <ion-label class="login-card__label">Nombre completo</ion-label>
                <div class="input-field">
                  <ion-icon :icon="personOutline" class="input-icon" />
                  <ion-input type="text" placeholder="Tu nombre" v-model="name" class="login-card__input" />
                </div>
              </div>

              <div class="input-group" :class="{ 'input-group--error': errors.email }">
                <ion-label class="login-card__label">Correo electrónico</ion-label>
                <div class="input-field">
                  <ion-icon :icon="mailOutline" class="input-icon" />
                  <ion-input type="email" placeholder="ejemplo@gmail.com" v-model="correo" class="login-card__input" />
                </div>
              </div>

              <div class="input-group" :class="{ 'input-group--error': errors.pass }">
                <ion-label class="login-card__label">Contraseña</ion-label>
                <div class="input-field">
                  <ion-icon :icon="lockClosedOutline" class="input-icon" />
                  <ion-input type="password" placeholder="********" v-model="password" class="login-card__input" />
                </div>
              </div>

              <div class="input-group" :class="{ 'input-group--error': errors.confirm }">
                <ion-label class="login-card__label">Confirmar contraseña</ion-label>
                <div class="input-field">
                  <ion-icon :icon="lockClosedOutline" class="input-icon" />
                  <ion-input type="password" placeholder="********" v-model="passwordConfirm" class="login-card__input" />
                </div>
              </div>

              <transition name="fade-slide">
                <p v-if="errorMsg" class="login-card__error">{{ errorMsg }}</p>
              </transition>

              <ion-button expand="block" type="submit" class="login-card__button" :disabled="cargando">
                <ion-icon slot="start" :icon="personAddOutline" v-if="!cargando" />
                {{ cargando ? 'Creando cuenta...' : 'Registrarse' }}
              </ion-button>

              <p class="signup-terms">
                Al registrarte, aceptas nuestros 
                <router-link to="/legal" class="terms-link">Términos y condiciones</router-link>.
              </p>

              <div class="register-link-container">
                <router-link to="/login" class="login-card__link">¿Ya tienes cuenta? Inicia sesión</router-link>
              </div>
            </form>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-title size="small">© 2025 Recetarizada</ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonBackButton, IonCard, IonCardContent, 
  IonInput, IonButton, IonLabel, IonIcon, IonFooter 
} from '@ionic/vue'
import { mailOutline, lockClosedOutline, personOutline, personAddOutline } from 'ionicons/icons'

import '../theme/register.css';

const router = useRouter()
const store = useMainStore()

const name = ref('')
const correo = ref('')
const password = ref('')
const passwordConfirm = ref('')
const errorMsg = ref('')

const cargando = computed(() => store.authLoading)
const shakeCard = ref(false)
const errors = ref({ name: false, email: false, pass: false, confirm: false })

const triggerShake = async () => {
  shakeCard.value = false
  await nextTick()
  shakeCard.value = true
  setTimeout(() => { shakeCard.value = false }, 350)
}

const handleRegister = async () => {
  errorMsg.value = ''
  errors.value = { name: false, email: false, pass: false, confirm: false }

  if (!name.value || !correo.value || !password.value || !passwordConfirm.value) {
    errorMsg.value = 'Por favor, rellena todos los campos.'
    errors.value.name = !name.value
    errors.value.email = !correo.value
    errors.value.pass = !password.value
    errors.value.confirm = !passwordConfirm.value
    await triggerShake()
    return
  }

  if (password.value !== passwordConfirm.value) {
    errorMsg.value = 'Las contraseñas no coinciden.'
    errors.value.pass = true
    errors.value.confirm = true
    await triggerShake()
    return
  }

  try {
    await store.register({ name: name.value, email: correo.value, password: password.value })
    router.push('/home')
  } catch (err: any) {
    errorMsg.value = err.message || 'No se pudo crear la cuenta.'
    await triggerShake()
  }
}
</script>