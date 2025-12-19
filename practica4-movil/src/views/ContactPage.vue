<script setup lang="ts">
/* 1. IMPORTACIÓN OBLIGATORIA DE COMPONENTES */
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons, 
  IonBackButton, 
  IonCard, 
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonFooter 
} from '@ionic/vue';
</script>
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" />
        </ion-buttons>
        <ion-title>Contacto</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="main-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Contacto</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <p>
              ¡Gracias por visitar <strong>Recetarizada</strong>!
            </p>
            <p>
              Si quieres escribirme con dudas o sugerencias, puedes hacerlo a través de mi correo o en mis redes sociales.
              También puedes escribir comentarios en las propias recetas de la página, ¡adelante!
            </p>
            <p>
              📧
              <a class="contact__email-link"
                 href="https://mail.google.com/mail/?view=cm&fs=1&to=erb37@gcloud.ua.es"
                 target="_blank" rel="noopener noreferrer">
                erb37@gcloud.ua.es
              </a>
            </p>

            <div class="contact__socials">
              <a class="contact__social-link" href="https://www.youtube.com" target="_blank">
                <img src="/youtube.png" alt="YouTube" class="contact__icon"/>
              </a>
              <a class="contact__social-link" href="https://www.instagram.com" target="_blank">
                <img src="/instagram.png" alt="Instagram" class="contact__icon"/>
              </a>
              <a class="contact__social-link" href="https://www.tiktok.com" target="_blank">
                <img src="/tiktok.png" alt="TikTok" class="contact__icon"/>
              </a>
              <a class="contact__social-link" href="https://www.twitter.com" target="_blank">
                <img src="/twitter.png" alt="Twitter" class="contact__icon"/>
              </a>
              <a class="contact__social-link" href="https://www.pinterest.com" target="_blank">
                <img src="/pinterest.png" alt="Pinterest" class="contact__icon"/>
              </a>
              <a class="contact__social-link" href="https://www.facebook.com" target="_blank">
                <img src="/facebook.png" alt="Facebook" class="contact__icon"/>
              </a>
            </div>
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
.main-container {
  max-width: 1100px;
  margin: 0 auto;
}

ion-card-content p {
  margin-bottom: 15px;
  text-align: justify;
  line-height: 1.4;
}

.contact__email-link {
  text-decoration: none;
  color: #00b388; 
  transition: opacity 0.2s;
}

.contact__email-link:hover {
  opacity: 0.7;
}

.contact__socials {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
}

.contact__social-link {
  display: inline-block;
  width: 32px;
  height: 32px;
  text-decoration: none;
  touch-action: manipulation;
}

.contact__icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
</style>