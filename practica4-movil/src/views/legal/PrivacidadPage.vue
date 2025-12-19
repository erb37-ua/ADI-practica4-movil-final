<template>
    <ion-page>
        <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
            <ion-back-button default-href="/" />
            </ion-buttons>
            <ion-title>Privacidad</ion-title>
        </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding" :fullscreen="true">
        <div class="main-container">
            <ion-card>
            <ion-card-content>
                <div class="legal-content">
                <h1 class="legal-title">Política de Privacidad</h1>

                <p class="legal-p">
                    En <strong>Recetarizada</strong> nos tomamos muy en serio la protección de tus datos personales.
                    La información que nos facilitas al registrarte o contactar se utiliza únicamente para gestionar tu cuenta
                    y mejorar tu experiencia de usuario.
                </p>

                <p class="legal-p">
                    Tus datos no se cederán a terceros salvo obligación legal o necesidad técnica para el funcionamiento del sitio.
                    Puedes solicitar en cualquier momento el acceso, rectificación o eliminación de tus datos escribiendo al
                    formulario de contacto.
                </p>

                <p class="legal-p">
                    Utilizamos cookies y tecnologías similares solo para mejorar el rendimiento y personalización de la web,
                    tal como se detalla en la
                    <ion-button fill="clear" router-link="/cookies" class="cookie-button">
                    Política de cookies
                    </ion-button>
                </p>

                <p class="legal-p">
                    Al continuar navegando en el sitio, aceptas nuestra política de privacidad y el tratamiento responsable de tus datos
                    conforme al Reglamento (UE) 2016/679 (RGPD).
                </p>

                <div class="about-image">
                    <img src="/privacidad.png" alt="Privacidad" />
                </div>
                </div>
            </ion-card-content>
            </ion-card>
        </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { 
    IonPage, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButtons, 
    IonBackButton, 
    IonCard, 
    IonCardContent,
    IonButton 
} from '@ionic/vue';
</script>

<style scoped>
.main-container {
    max-width: 1100px;
    margin: 0 auto;
}

.legal-content {
    text-align: justify;
}

.legal-title {
    font-size: 28px;
    margin: 0 0 16px 0;
    color: #000;
}

.legal-p {
    margin-bottom: 15px;
    line-height: 1.4;
}

.cookie-button {
    --color: #00b388; 
    --padding-start: 0;
    --padding-end: 0;
    margin: 0;
    height: auto;
    text-transform: none; 
}

.about-image {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.about-image img {
    width: min(180px, 80%);
    height: auto;
    border-radius: 12px;
    object-fit: contain;
}
</style>