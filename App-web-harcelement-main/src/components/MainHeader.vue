<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// On crée une variable réactive pour stocker l'utilisateur
// Par défaut, on met des valeurs vides pour éviter les erreurs d'affichage
const user = ref({
  nom: 'Invité',
  role: 'Utilisateur',
  email: ''
})

// Cette fonction s'exécute dès que le composant est affiché à l'écran
onMounted(() => {
  const storedUser = localStorage.getItem('user')
  
  if (storedUser) {
    // On transforme le texte JSON du localStorage en objet JavaScript
    user.value = JSON.parse(storedUser)
    console.log("Utilisateur connecté affiché :", user.value.nom)
  } else {
    // Si pas d'utilisateur, on renvoie vers le login par sécurité
    router.push('/login')
  }
})

// Fonction pour se déconnecter
const handleLogout = () => {
  localStorage.removeItem('user') // On vide la session
  router.push('/login')           // On repart au login
}
</script>

<template>
  <header class="main-header">
    <div class="header-left">
      <span class="app-logo">LegalTech</span>
      <nav class="top-nav">
        <RouterLink to="/dashboard" class="nav-link">Tableau de bord</RouterLink>
        <button @click="handleLogout" class="btn-logout">
        Déconnexion
      </button>
      </nav>
    </div>
    

    <div class="user-profile">
      <div class="user-details">
        <span class="user-name">{{ user.nom }}</span>
        <span class="user-role">{{ user.role }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped>


</style>