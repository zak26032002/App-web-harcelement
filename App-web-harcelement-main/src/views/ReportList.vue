<script setup lang="ts">
import { ref, computed } from 'vue'
import MainHeader from '../components/MainHeader.vue'

const filtreStatut = ref('Tous')
const filtreType = ref('Tous')

const signalements = ref([
  { id: 'SIG-001', type: 'Harcèlement', date: '2026-01-10', statut: 'Ouvert' },
  { id: 'SIG-002', type: 'Discrimination', date: '2026-02-15', statut: 'Non lu' },
  { id: 'SIG-003', type: 'Harcèlement', date: '2026-01-05', statut: 'Ouvert' },
  { id: 'SIG-004', type: 'Autre', date: '2026-03-01', statut: 'Clos' },
])

// Logique de filtrage dynamique
const signalementsFiltrés = computed(() => {
  return signalements.value.filter(s => {
    const matchStatut = filtreStatut.value === 'Tous' || s.statut === filtreStatut.value
    const matchType = filtreType.value === 'Tous' || s.type === filtreType.value
    return matchStatut && matchType
  })
})
</script>

<template>
    <header
    <div class="app-layout">
    <MainHeader />

    <main class="page-content">
      <RouterView />
    </main>
</header>

  <div class="dashboard-container">
    <h1>Tous les signalements</h1>

    <div class="filter-bar">
      <select v-model="filtreStatut">
        <option value="Tous">Tous les statuts</option>
        <option value="Ouvert">Ouvert</option>
        <option value="Non lu">Non lu</option>
        <option value="Clos">Clos</option>
      </select>

      <select v-model="filtreType">
        <option value="Tous">Tous les types</option>
        <option value="Harcèlement">Harcèlement</option>
        <option value="Discrimination">Discrimination</option>
        <option value="Autre">Autre</option>
      </select>
      
      <span>Nombre de cas : {{ signalementsFiltrés.length }}</span>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cas in signalementsFiltrés" :key="cas.id">
            <td>{{ cas.id }}</td>
            <td>{{ cas.type }}</td>
            <td>{{ cas.date }}</td>
            <td><span :class="['badge', cas.statut === 'Clos' ? 'badge-new' : 'badge-urgent']">{{ cas.statut }}</span></td>
            <td><button class="btn-primary">Ouvrir le ticket</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
}
select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}
</style>