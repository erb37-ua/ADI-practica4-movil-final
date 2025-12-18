<template>
    <ion-page>
        <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
            <ion-back-button default-href="/home" />
            </ion-buttons>

            <ion-title>Sobre mí</ion-title>

            <ion-buttons slot="end">
            <ion-button router-link="/profile">
                <ion-icon :icon="personCircleOutline" slot="icon-only" />
            </ion-button>
            </ion-buttons>
        </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" class="ion-padding">
        <ion-card>
            <ion-card-header>
            <ion-card-title>Sobre mí</ion-card-title>
            </ion-card-header>

            <ion-card-content>
            <p>
                ¡Hola! Soy estudiante de 4º de carrera de ingeniería informática y, aunque paso muchas horas entre apuntes y trabajos, uno de mis mayores hobbies es cocinar.
            Y para que sepáis un poco más de mí, aunque es bastante obvio por el nombre, os dejo una imagen por aquí.
            </p>
            <p>
                Aquí encontrarás recetas sencillas, todas hechas por mí. Espero que te sirvan para inspirarte, aprender algo nuevo o simplemente disfrutar de la cocina tanto como yo.
            </p>
            <p>
                Bienvenido/a a mi rincón culinario, ¡ojalá lo disfrutes tanto como yo al crearlo! 🌿✨
            </p>

            <div class="about-image">
                <img :src="yoImg" alt="Foto sobre mí" />
            </div>
            </ion-card-content>
        </ion-card>
        </ion-content>

        <ion-footer>
        <ion-toolbar>
            <ion-title size="small">© 2025 Recetarizada</ion-title>
        </ion-toolbar>
        </ion-footer>
    </ion-page>
</template>

<script setup lang="ts">
    import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonButton, IonIcon, IonBackButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonFooter
    } from '@ionic/vue';

    import { personCircleOutline } from 'ionicons/icons';

    import yoImg from '/yo.jpeg';
</script>

<style scoped src="./about.css"></style>
