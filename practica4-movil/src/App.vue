<template>
  <ion-app>
    <AppHeader />
    
    <ion-router-outlet />
    <Footer />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import AppHeader from '@/components/AppHeader.vue';
// @ts-ignore
import Footer from '@/components/Footer.vue';
</script>