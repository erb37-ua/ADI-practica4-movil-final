<template>
    <ion-footer class="ion-no-border">
        <ion-toolbar class="site-footer">
        <div class="site-footer__inner">
            
            <div class="site-footer__left">
            &copy; 2025 Recetarizada
            </div>

            <nav class="site-footer__center" aria-label="Enlaces legales">
            <router-link to="/contact">Contacto</router-link>
            <span>|</span>
            <router-link to="/about">About</router-link>
            <span>|</span>
            <router-link to="/legal">Aviso</router-link>
            <span>|</span>
            <router-link to="/privacidad">Privacidad</router-link>
            <span>|</span>
            <router-link to="/cookies">Cookies</router-link>
            </nav>

            <div class="site-footer__right" aria-label="Redes sociales">
            <a v-for="social in socialLinks" :key="social.alt" 
                class="site-footer__social-link" :href="social.url" target="_blank">
                <img class="site-footer__social-icon" :src="social.icon" :alt="social.alt" />
            </a>
            </div>

        </div>
        </ion-toolbar>
    </ion-footer>
</template>

<script setup lang="ts">
import { IonFooter, IonToolbar } from '@ionic/vue';

const socialLinks = [
    { icon: '/youtube.png', alt: 'YouTube', url: 'https://www.youtube.com' },
    { icon: '/instagram.png', alt: 'Instagram', url: 'https://www.instagram.com' },
    { icon: '/tiktok.png', alt: 'TikTok', url: 'https://www.tiktok.com' },
    { icon: '/twitter.png', alt: 'Twitter', url: 'https://www.twitter.com' },
    { icon: '/pinterest.png', alt: 'Pinterest', url: 'https://www.pinterest.com' },
    { icon: '/facebook.png', alt: 'Facebook', url: 'https://www.facebook.com' },
];
</script>

<style scoped>
.site-footer {
    --background: #d2694c;
    --color: #000000;
    /* Reducción extrema del acolchado vertical */
    --padding-top: 4px;
    --padding-bottom: 4px;
    font-family: 'Itim', sans-serif;
    min-height: 40px; /* Forzamos una altura mínima pequeña */
}

.site-footer__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    width: 100%;
    padding: 4px 10px;
}

.site-footer__left {
    font-size: 11px;
    font-weight: bold;
}

.site-footer__center {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
    font-size: 11px;
    color: #000;
}

.site-footer__center span {
  opacity: 0.3; /* Separadores visuales suaves */
}

.site-footer__center a {
    color: inherit;
    text-decoration: none;
}

.site-footer__right {
    display: flex;
    gap: 10px;
    margin-top: 2px;
}

.site-footer__social-link {
    width: 18px; /* Iconos reducidos de 22px a 18px */
    height: 18px;
    display: flex;
    align-items: center;
}

.site-footer__social-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

@media (min-width: 768px) {
    .site-footer__inner {
        flex-direction: row;
        justify-content: space-between;
        padding: 0 20px;
    }
    .site-footer__center {
        font-size: 12px;
    }
}
</style>