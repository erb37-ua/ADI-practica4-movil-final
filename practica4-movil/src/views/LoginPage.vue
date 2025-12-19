<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonBackButton, IonCard, IonCardContent, 
  IonInput, IonButton, IonLabel, IonIcon, IonFooter 
} from '@ionic/vue'
import { mailOutline, lockClosedOutline, logInOutline } from 'ionicons/icons'

const router = useRouter()
const store = useMainStore()

const correo = ref('')
const password = ref('')

const errorMsg = ref('')
const cargando = computed(() => store.authLoading)

// Estado visual para errores y animación
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
                    placeholder="**********************"
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

<style scoped>
.login-center-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}

.login-card {
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
}

.login-card__title {
  font-size: 28px;
  margin-bottom: 28px;
  font-weight: bold;
  text-align: center;
  color: #000;
}

.input-group {
  margin-bottom: 22px;
  text-align: left;
}

.login-card__label {
  display: block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.input-field {
  display: flex;
  align-items: center;
  border: 1px solid #2b5b5b;
  border-radius: 10px;
  padding: 0 12px;
  background: #fff;
  transition: all 0.2s ease-in-out;
}

.input-field:focus-within {
  border: 2px solid #000 !important;
}

.input-icon {
  font-size: 20px;
  color: #666;
  margin-right: 10px;
}

.input-field:focus-within .input-icon {
  color: #000;
}

.login-card__input {
  --padding-start: 0;
  font-family: 'Itim', sans-serif;
  color: #000;
  caret-color: #000 !important;
}

.login-card__input::part(native) {
  caret-color: #000 !important;
}

/* === ERRORES === */
.input-group--error .input-field {
  border-color: #e63946 !important;
  box-shadow: 0 0 0 2px rgba(230, 57, 70, 0.15);
}

.login-card__error {
  color: #e63946;
  font-size: 14px;
  margin: 0 0 12px;
  text-align: left;
}

/* BOTÓN */
.login-card__button {
  --background: var(--dark);
  --color: #fff;
  --border-radius: 12px;
  margin-top: 16px;
  font-family: 'Itim', sans-serif;
}

.login-card__link {
  font-size: 14px;
  text-decoration: underline;
  font-weight: bold;
  color: #2b5b5b;
}

.register-link-container {
  text-align: center;
  margin-top: 15px;
}

/* ANIMACIONES */
@keyframes login-shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
  100% { transform: translateX(0); }
}

.login-card--shake {
  animation: login-shake 0.3s;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.22s, transform 0.22s;
}

.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>