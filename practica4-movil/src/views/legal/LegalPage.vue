<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" />
        </ion-buttons>
        <ion-title>Aviso Legal</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="main-container">
        <ion-card>
          <ion-card-content>
            <div class="legal-content">
              <h1 class="legal-title">Aviso Legal</h1>

              <p class="legal-p">
                En cumplimiento con la legislación vigente, se informa a los usuarios que el sitio web
                <strong>Recetarizada</strong> es gestionado por una persona particular.
                El acceso a esta web implica la aceptación de los términos y condiciones descritos en este aviso.
              </p>

              <p class="legal-p">
                Todos los contenidos publicados —incluyendo textos, imágenes, recetas y código— son propiedad de Recetarizada
                o se utilizan con autorización de sus autores.
                Queda prohibida la reproducción total o parcial sin consentimiento previo por escrito.
              </p>

              <p class="legal-p">
                Recetarizada no se hace responsable del uso indebido de la información ni de posibles daños derivados del
                acceso o utilización de los contenidos del sitio web.
              </p>

              <p class="legal-p">
                Para cualquier duda o comunicación relacionada con esta web, puedes contactar a través del formulario
                de contacto disponible en la sección
                <ion-button fill="clear" router-link="/contact" class="legal-link-btn">
                  Contacto
                </ion-button>
              </p>

              <div class="about-image">
                <img src="/legal.png" alt="Aviso Legal" />
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
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonCard, IonCardContent,
  IonButton 
} from '@ionic/vue';

import '../../theme/legal.css';
</script>