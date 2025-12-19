<template>
    <ion-page>
        <ion-content>
        <div class="profile-wrapper">
            <ion-card class="green-card" :class="{ 'profile-card--shake': shakeForm }">
            <ion-card-header>
                <ion-card-title class="main-title">Perfil</ion-card-title>
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
                        placeholder="********************" 
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

    const router = useRouter()
    const store = useMainStore()

    // Estados del formulario idénticos al original
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

    // Efecto Shake (Misma lógica de setTimeout y nextTick)
    const triggerShake = async () => {
    shakeForm.value = false
    await nextTick()
    shakeForm.value = true
    setTimeout(() => { shakeForm.value = false }, 400)
    }

    // Carga de datos (Sync con el Store)
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

    // Guardar Cambios (Funcionalidad idéntica)
    const handleSave = async () => {
    // 1. Validación de coincidencia
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
        console.error('updateProfile error', error)
        errorMsg.value = error.message || 'No se pudo actualizar el perfil.'

        const msg = errorMsg.value.toLowerCase()
        // Identificación de error en password actual (Misma lógica original)
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

    // Eliminar cuenta (Migrado de confirm() a Alert de Ionic)
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

<style scoped>
.profile-wrapper {
    display: flex;
    justify-content: center;
    padding: 20px 10px;
    background-color: var(--bg);
    min-height: 100%;
}

.main-title {
    font-family: var(--app-font);
    font-size: 32px;
    font-weight: bold;
    color: #000;
    text-align: center;
}

.field-container { margin-bottom: 18px; }

.custom-label {
    display: block;
    font-weight: bold;
    color: #333;
    margin-bottom: 6px;
    font-size: 16px;
}

.custom-input-box {
    display: flex;
    align-items: center;
    border: 1.5px solid var(--dark);
    border-radius: 14px;
    padding: 2px 14px;
    background: #fff;
    height: 48px;
}

.input-icon { font-size: 20px; color: #666; margin-right: 12px; }

.inner-input {
    --padding-start: 0;
    font-family: var(--app-font);
    font-size: 16px;
}

.disabled { background-color: #fcfcfc; opacity: 0.8; }

.action-buttons { display: flex; gap: 12px; margin-top: 20px; }

.btn-dark {
  flex: 1;
    --background: var(--dark);
    --border-radius: 12px;
    --color: #fff;
    font-weight: bold;
    height: 50px;
    text-transform: none;
}

.delete-container { display: flex; justify-content: center; margin-top: 15px; }

.btn-danger {
    --background: var(--accent);
    --border-radius: 14px;
    --color: #fff;
    width: 65%;
    height: 45px;
    text-transform: none;
    font-weight: bold;
}

/* Manejo de errores visuales igual al original */
.error-border .custom-input-box {
    border-color: #e63946;
    box-shadow: 0 0 0 2px rgba(230, 57, 70, 0.15);
}

.error-msg { color: #e63946; text-align: center; font-size: 14px; margin: 8px 0; }
.info-msg { color: #2b9348; text-align: center; font-size: 14px; margin: 8px 0; }

/* Transiciones fade-slide */
.fade-slide-enter-active, .fade-slide-leave-active {
    transition: opacity 0.22s, transform 0.22s;
}
.fade-slide-enter-from, .fade-slide-leave-to {
    opacity: 0; transform: translateY(-6px);
}

/* Animación Shake idéntica */
@keyframes profile-shake {
    0% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
    100% { transform: translateX(0); }
}

.profile-card--shake {
    animation: profile-shake 0.3s;
}
</style>