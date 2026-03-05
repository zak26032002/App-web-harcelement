<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Variables pour le formulaire
const email = ref('')
const password = ref('')
const error = ref(false)

const handleLogin = () => {
  // Simulation d'authentification simple pour le moment
  if (email.value === 'admin@entreprise.fr' && password.value === 'password') {
    error.value = false
    // On redirige vers le dashboard
    router.push('/')
  } else {
    error.value = true
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <span class="app-logo">LegalTech</span>
        <h1>Connexion</h1>
        <p class="subtitle">Accès réservé au personnel habilité (RH / Juristes)</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Adresse e-mail</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="nom@entreprise.fr" 
            required
          >
        </div>

        <div class="form-group">
          <label>Mot de passe</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            required
          >
        </div>

        <p v-if="error" class="error-msg">Identifiants incorrects. Veuillez réessayer.</p>

        <button type="submit" class="btn-primary btn-block">
          Se connecter
        </button>
      </form>
      
      <div class="login-footer">
        <p>En cas d'oubli, contactez le service informatique.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ton futur CSS */
</style>