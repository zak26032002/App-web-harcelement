<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MainHeader from '../components/MainHeader.vue'

// 1. Déclaration de la variable qui va stocker les signalements
// On utilise 'any[]' pour éviter les erreurs de type strict pour l'instant
const reports = ref<any[]>([])
const loading = ref(true)
const errorMsg = ref('')

// 2. Fonction pour récupérer les données depuis le Backend
const fetchReports = async () => {
  console.log("Tentative de récupération des signalements...");
  loading.value = true
  errorMsg.value = ''
  
  try {
    const response = await fetch('http://localhost:3000/api/reports')
    
    if (!response.ok) {
      throw new Error(`Erreur serveur : ${response.status}`)
    }

    const result = await response.json()
    
    if (result.success) {
      reports.value = result.data
      console.log("Données reçues avec succès :", result.data)
    } else {
      errorMsg.value = "Le serveur a renvoyé une erreur."
    }
  } catch (error) {
    console.error("Erreur de connexion au backend :", error)
    errorMsg.value = "Impossible de joindre le serveur. Vérifie que le Backend tourne."
  } finally {
    loading.value = false
  }
}

// 3. Appel automatique de la fonction quand on arrive sur la page
onMounted(() => {
  fetchReports()
})
</script>

<template>
  <div class="dashboard">
    <header>
      <div class="app-layout">
    <MainHeader />

    <main class="page-content">
      <RouterView />
    </main>
  </div>
  
    </header>

    <div v-if="loading" class="info-box">Chargement des signalements...</div>

    <div v-else-if="errorMsg" class="error-box">{{ errorMsg }}</div>

    <table v-else class="report-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Type</th>
          <th>Description</th>
          <th>Statut</th>
          <th>Priorité</th>
        </tr>
      </thead>
          <tbody>
            <tr v-for="item in reports" :key="item.id">
              <td>#{{ item.id }}</td>
              <td><strong>{{ item.type }}</strong></td>
              <td>{{ item.description }}</td>
              <td>
                <span :class="'status-' + (item.statut ? item.statut.toLowerCase() : 'ouvert')">
                  {{ item.statut }}
                </span>
              </td>
              <td>{{ item.priorite }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>