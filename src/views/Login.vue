<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Initialisation des outils
const router = useRouter()

// Variables réactives pour le formulaire
const email = ref('')
const password = ref('')
const error = ref(false)
const errorMessage = ref('')

/**
 * Fonction de connexion
 */
const handleLogin = async () => {
  console.log("1. Tentative d'envoi vers le backend...");
  error.value = false; // Réinitialise l'erreur à chaque tentative

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        email: email.value, 
        password: password.value 
      })
    });

    console.log("2. Réponse brute reçue, statut :", response.status);

    const data = await response.json();
    console.log("3. Données JSON reçues :", data);

    if (data.success) {
      // SUCCÈS
      console.log("Connexion réussie ! Redirection en cours...");
      
      // On stocke les infos utilisateur dans le navigateur
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirection vers le Dashboard (la route '/dashboard')
      await router.push('/dashboard');
    } else {
      // ERREUR IDENTIFIANTS
      error.value = true;
      errorMessage.value = data.message || "Identifiants incorrects";
    }

  } catch (err) {
    // ERREUR TECHNIQUE (Serveur éteint, etc.)
    console.error("4. ERREUR CRITIQUE :", err);
    error.value = true;
    errorMessage.value = "Impossible de joindre le serveur de base de données.";
  }
};
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
</style>