<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonBackButton, IonCard, IonCardContent, 
  IonInput, IonButton, IonLabel, IonIcon
} from '@ionic/vue'
import { mailOutline, lockClosedOutline, personOutline, personAddOutline } from 'ionicons/icons'


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

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/login" />
        </ion-buttons>
        <ion-title>Registro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="login-center-wrapper">
        <ion-card class="login-card green-card" :class="{ 'login-card--shake': shakeCard }">
          <ion-card-content>
            <h2 class="login-card__title">Crear cuenta</h2>

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
  margin-bottom: 24px;
  font-weight: bold;
  text-align: center;
}

.input-group {
  margin-bottom: 18px;
  text-align: left;
}

.login-card__label {
  display: block;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #333;
}

.input-field {
  display: flex;
  align-items: center;
  border: 1px solid #2b5b5b;
  border-radius: 10px;
  padding: 0 12px;
  background: #fff;
  transition: all 0.2s ease;
}

.input-field:focus-within {
  border: 2px solid #000 !important;
}

.input-icon {
  font-size: 18px;
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

.input-group--error .input-field {
  border-color: #e63946 !important;
  box-shadow: 0 0 0 2px rgba(230, 57, 70, 0.15);
}

.login-card__error {
  color: #e63946;
  font-size: 13px;
  margin-bottom: 12px;
}

.login-card__button {
  --background: var(--dark);
  --color: #fff;
  --border-radius: 12px;
  margin-top: 10px;
  height: 44px;
}

.signup-terms {
  font-size: 11px;
  color: #666;
  text-align: center;
  margin-top: 14px;
}

.terms-link {
  color: #666;
  text-decoration: underline;
}

.register-link-container {
  text-align: center;
  margin-top: 15px;
}

.login-card__link {
  font-size: 14px;
  text-decoration: underline;
  font-weight: bold;
  color: #2b5b5b;
}

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