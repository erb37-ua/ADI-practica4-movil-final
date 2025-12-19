<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" />
        </ion-buttons>
        <ion-title>Iniciar sesión</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="login-center-wrapper">
        <ion-card class="login-card green-card" :class="{ 'login-card--shake': shakeLogin }">
          <ion-card-content>
            <h2 class="login-card__title">Iniciar sesión</h2>

            <form @submit.prevent="handleSubmit">
              <div class="input-group" :class="{ 'input-group--error': emailError }">
                <ion-label class="login-card__label">Correo electrónico</ion-label>
                <div class="input-field">
                  <ion-icon :icon="mailOutline" class="input-icon" />
                  <ion-input
                    type="email"
                    placeholder="ejemplo@gmail.com"
                    v-model="correo"
                    required
                    class="login-card__input"
                  />
                </div>
              </div>

              <div class="input-group" :class="{ 'input-group--error': passwordError }">
                <ion-label class="login-card__label">Contraseña</ion-label>
                <div class="input-field">
                  <ion-icon :icon="lockClosedOutline" class="input-icon" />
                  <ion-input
                    type="password"
                    placeholder="********"
                    v-model="password"
                    required
                    class="login-card__input"
                  />
                </div>
              </div>

              <transition name="fade-slide">
                <p v-if="errorMsg" class="login-card__error">
                  {{ errorMsg }}
                </p>
              </transition>

              <ion-button
                expand="block"
                type="submit"
                class="login-card__button"
                :disabled="cargando"
              >
                <ion-icon slot="start" :icon="logInOutline" v-if="!cargando" />
                {{ cargando ? 'Entrando...' : 'Iniciar sesión' }}
              </ion-button>

              <div class="register-link-container">
                <router-link to="/register" class="login-card__link">
                  ¿No tienes cuenta? Regístrate
                </router-link>
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
  IonInput, IonButton, IonLabel, IonIcon
} from '@ionic/vue'
import { mailOutline, lockClosedOutline, logInOutline } from 'ionicons/icons'

import '../theme/login.css';

const router = useRouter()
const store = useMainStore()

const correo = ref('')
const password = ref('')

const errorMsg = ref('')
const cargando = computed(() => store.authLoading)

const shakeLogin = ref(false)
const emailError = ref(false)
const passwordError = ref(false)

const triggerShake = async () => {
  shakeLogin.value = false
  await nextTick()
  shakeLogin.value = true
  setTimeout(() => {
    shakeLogin.value = false
  }, 350)
}

const handleSubmit = async () => {
  emailError.value = false
  passwordError.value = false

  if (!correo.value || !password.value) {
    errorMsg.value = 'Rellena correo y contraseña.'
    emailError.value = !correo.value
    passwordError.value = !password.value
    await triggerShake()
    return
  }

  errorMsg.value = ''

  try {
    await store.login(correo.value, password.value)
    router.push('/home') 
  } catch (err: any) {
    errorMsg.value = err.message || 'Error al iniciar sesión.'
    emailError.value = true
    passwordError.value = true
    await triggerShake()
  }
}
</script>
