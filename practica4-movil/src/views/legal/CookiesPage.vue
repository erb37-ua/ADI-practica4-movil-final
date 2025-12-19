<template>
    <ion-page>
        <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
            <ion-back-button default-href="/" />
            </ion-buttons>
            <ion-title>Política de Cookies</ion-title>
        </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding" :fullscreen="true">
        <ion-card class="cookies-card">
            <ion-card-content>
            <ion-grid>
                <ion-row class="cookies-row">
                <!-- Texto -->
                <ion-col size="12" size-md="7">
                    <h1 class="cookies-title">Política de Cookies</h1>

                    <p class="cookies-p">
                    Este sitio web utiliza cookies propias y de terceros con el objetivo de ofrecer una mejor experiencia de navegación,
                    optimizar el rendimiento del sitio y analizar la interacción de los usuarios con los contenidos.
                    </p>

                    <p class="cookies-p">
                    Las cookies son pequeños archivos de texto que el navegador almacena en tu dispositivo. Puedes configurar o rechazar su uso
                    desde las preferencias de tu navegador en cualquier momento.
                    </p>

                    <p class="cookies-p">
                    Tipos de cookies que utilizamos:
                    </p>

                    <ion-list class="cookies-list" lines="none">
                        <ion-item class="cookies-item" lines="none">
                            <ion-label class="cookies-li">
                            Cookies técnicas: necesarias para el correcto funcionamiento del sitio.
                            </ion-label>
                        </ion-item>

                        <ion-item class="cookies-item" lines="none">
                            <ion-label class="cookies-li">
                            Cookies de análisis: nos ayudan a mejorar el contenido mediante estadísticas anónimas.
                            </ion-label>
                        </ion-item>

                        <ion-item class="cookies-item" lines="none">
                            <ion-label class="cookies-li">
                            Cookies de preferencias: guardan tus elecciones (como idioma o tema visual).
                            </ion-label>
                        </ion-item>
                    </ion-list>


                    <p class="cookies-p">
                    Al continuar navegando en Recetarizada, aceptas el uso de cookies conforme a esta política.
                    Puedes obtener más información o revocar tu consentimiento en cualquier momento desde tu navegador.
                    </p>
                </ion-col>

                <div class="about-image">
                    <img src="/cookies.png" alt="Aviso Legal" />
                </div>

                </ion-row>
            </ion-grid>
            </ion-card-content>
        </ion-card>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton,
    IonCard, IonCardContent,
    IonGrid, IonRow, IonCol,
    IonList, IonItem, IonLabel
} from '@ionic/vue'
</script>

<style scoped>


    /*Margen inferior*/
    .cookies-list{
        margin: 6px 0 12px 0;
    }

    .cookies-p {
        font-size: 15px !important;
        line-height: 1.5;
        color: #000;
        margin-bottom: 12px;
        text-align: justify;
    }

    .cookies-item ion-label.cookies-li {
        font-size: 15px !important; 
        line-height: 1.5;
        color: #000;
        margin: 0;
        white-space: normal;
        padding-left: 20px;
        position: relative;
    }

    .cookies-li::before {
        content: "•";
        position: absolute;
        left: 0;
        top: 0;
        font-size: 18px; 
        color: #000;
    }


    :deep(ion-list.cookies-list),
    :deep(ion-list.cookies-list::part(native)){
        background: transparent !important;
        padding: 0 !important;
    }

    :deep(ion-item.cookies-item),
    :deep(ion-item.cookies-item::part(native)){
    --background: transparent !important;
    --ion-item-background: transparent !important;
    background: transparent !important;

    --inner-border-width: 0px;
    --border-width: 0px;
    --padding-start: 0px;
    --inner-padding-end: 0px;
}


</style>
