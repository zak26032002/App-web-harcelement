<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref<any>(null)

onMounted(() => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
  }
})

const handleLogout = () => {
  localStorage.clear()
  router.push('/login')
}
</script>

<template>
  <header class="main-header">
    <div class="header-left">
      <div class="app-logo" @click="router.push('/')" style="cursor: pointer;">
        Legal<b>Tech</b>
      </div>
      
      <nav class="top-nav">
        <router-link to="/mon-espace" class="nav-link">Mon Espace</router-link>

        <router-link 
          v-if="user && (user.role.toLowerCase() === 'rh' || user.role.toLowerCase() === 'juriste')" 
          to="/dashboard" 
          class="nav-link"
        >
          Tableau de bord
        </router-link>

        <router-link 
          v-if="user && user.role.toLowerCase() === 'admin'" 
          to="/admin" 
          class="nav-link"
        >
          Administration
        </router-link>
      </nav>
    </div>

    <div class="header-right">
      <div class="user-profile">
        <div v-if="user" class="user-details">
          <span class="user-name">{{ user.nom }}</span>
          <span class="user-role">{{ user.role }}</span>
        </div>
        <button @click="handleLogout" class="btn-logout">
          Déconnexion
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>

</style>