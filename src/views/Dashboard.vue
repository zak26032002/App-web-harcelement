<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainHeader from '../components/MainHeader.vue'


const router = useRouter()

// Données fictives (on rajoute des dates pour le tri)
const signalements = ref([
  { id: 'SIG-001', type: 'Harcèlement', date: '2026-01-10', statut: 'Ouvert', priorite: 'Critique' },
  { id: 'SIG-002', type: 'Discrimination', date: '2026-02-15', statut: 'Non lu', priorite: 'Moyenne' },
  { id: 'SIG-003', type: 'Harcèlement', date: '2026-01-05', statut: 'Ouvert', priorite: 'Haute' },
  { id: 'SIG-004', type: 'Autre', date: '2026-03-01', statut: 'Clos', priorite: 'Basse' },
])

// Stats pour la vue synthétique
const totalOuverts = computed(() => signalements.value.filter(s => s.statut !== 'Clos').length)
const totalNonLus = computed(() => signalements.value.filter(s => s.statut === 'Non lu').length)

// On récupère les 3 plus anciens (tri par date)
const casAnciens = computed(() => {
  return [...signalements.value]
    .filter(s => s.statut !== 'Clos')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)
})

</script>

<template>
  <div class="dashboard-container">
    <header>
      <div class="app-layout">
    <MainHeader />

    <main class="page-content">
      <RouterView />
    </main>
  </div>
    </header>

    <section class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">Cas en cours</span>
        <span class="stat-value">{{ totalOuverts }}</span>
      </div>
      <div class="stat-card urgent">
        <span class="stat-label">Non lus</span>
        <span class="stat-value">{{ totalNonLus }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Délai moyen de réponse</span>
        <span class="stat-value">2.5j</span>
      </div>
    </section>

    <section class="table-container">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem;">
        <h2>Cas les plus anciens à traiter</h2>
        <button @click="router.push('/reports')" class="btn-primary">Voir tous les signalements</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Ancienneté</th>
            <th>Priorité</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cas in casAnciens" :key="cas.id">
            <td>{{ cas.id }}</td>
            <td>{{ cas.type }}</td>
            <td>{{ cas.date }}</td>
            <td><span class="badge badge-urgent">{{ cas.priorite }}</span></td>
            <td><button @click="router.push(`/signalement/${cas.id}`)" class="btn-primary">Traiter</button></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>