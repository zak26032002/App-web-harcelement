<script setup lang="ts">
import { useRoute } from 'vue-router'
import MainHeader from '../components/MainHeader.vue'
const route = useRoute()
const idSignalement = route.params.id // Récupère le "SIG-001" de l'URL

</script>

<template>
  <header>
      <div class="app-layout">
    <MainHeader />

    <main class="page-content">
      <RouterView />
    </main>
  </div>
    </header>

<div class="detail-container">
    <h1>Détails du signalement</h1>
    <div class="info-card">
      <p>Vous consultez actuellement le dossier : <strong>{{ idSignalement }}</strong></p>
    </div>
    
    </div>
</template>

<style scoped>
/* Ton futur CSS */
</style>