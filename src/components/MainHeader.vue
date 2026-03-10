<script setup lang="ts">
import { ref } from 'vue'

// Ces données pourraient plus tard venir d'un "Store" (Pinia) après la connexion
const nomUtilisateur = ref('Jean Dupont')
const role = ref('Responsable RH')
</script>

<template>
  <header class="main-header">
    <div class="header-left">
      <span class="app-logo">LegalTech</span>
      <nav class="top-nav">
        <RouterLink to="/dashboard" class="nav-link">Tableau de bord</RouterLink>
        <RouterLink to="/reports" class="nav-link">Signalements</RouterLink>
        <RouterLink to="/login" class="nav-link">Déconnexion</RouterLink>
      </nav>
    </div>
    

    <div class="header-right">
      <div class="user-info">
        <span class="welcome-msg">Bonjour, <strong>{{ nomUtilisateur }}</strong></span>
        <span class="user-role">{{ role }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped>


</style>