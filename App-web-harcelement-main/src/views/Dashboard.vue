<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import MainHeader from '../components/MainHeader.vue'
import Footer from '@/components/Footer.vue'

const reports = ref<any[]>([])
const loading = ref(true)
const errorMsg = ref('')

// Filtres pour le traitement RH 
const filterStatus = ref('TOUS')

const fetchReports = async () => {
  loading.value = true
  try {
    const response = await fetch('http://localhost:3000/api/reports')
    const result = await response.json()
    if (result.success) {
      reports.value = result.data
    }
  } catch (error) {
    errorMsg.value = "Erreur de connexion au serveur."
  } finally {
    loading.value = false
  }
}

// Statistiques (Fonctionnalité complémentaire MoSCoW) 
const stats = computed(() => {
  return {
    total: reports.value.length,
    open: reports.value.filter(r => r.statut === 'OUVERT').length,
    critical: reports.value.filter(r => r.priorite === 'Critique').length
  }
})

// Filtrage dynamique 
const filteredReports = computed(() => {
  if (filterStatus.value === 'TOUS') return reports.value
  return reports.value.filter(r => r.statut === filterStatus.value)
})

// Mise à jour du statut 
const updateStatus = async (id: number, newStatus: string) => {
  // Note: Un motif est obligatoire à la clôture selon le doc 
  if (newStatus.includes('CLOS')) {
    const reason = prompt("Veuillez saisir un motif de clôture (obligatoire) :");
    if (!reason) return;
  }
  
  // Ici l'appel API pour mettre à jour la BDD
  console.log(`Mise à jour du signalement #${id} vers ${newStatus}`);
}

const formatStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'OUVERT': 'Ouvert',
    'EN_COURS': 'En cours',
    'EN_ATTENTE_INFO': 'En attente',
    'CLOS_FONDE': 'Clos (Fondé)',
    'CLOS_NON_FONDE': 'Clos (Non fondé)'
  };
  return labels[status] || status;
};

onMounted(fetchReports)
</script>

<template>
  <div class="dashboard-container">
    <MainHeader />

    <main class="page-content">
      <section class="stats-grid">
        <div class="stat-card">
          <span class="stat-label">Total Signalements</span>
          <span class="stat-value">{{ stats.total }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Dossiers Ouverts</span>
          <span class="stat-value" style="color: #27ae60;">{{ stats.open }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Alertes Critiques</span>
          <span class="stat-value" style="color: #e74c3c;">{{ stats.critical }}</span>
        </div>
      </section>

      <div class="filter-bar">
        <label>Filtrer par statut :</label>
        <select v-model="filterStatus">
          <option value="TOUS">Tous les dossiers</option>
          <option value="OUVERT">Ouverts</option>
          <option value="EN_COURS">En cours</option>
          <option value="CLOS_FONDE">Clos (Fondé)</option>
        </select>
      </div>

      <div v-if="loading" class="info-box">Chargement...</div>

      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>Code Suivi</th> <th>Type</th>
              <th>Description</th>
              <th>Pièce Jointe</th> <th>Statut</th> <th>Priorité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredReports" :key="item.id">
              <td><code class="tracking-code">{{ item.code_suivi }}</code></td>
              <td><strong>{{ item.type }}</strong></td>
              <td class="description-cell">{{ item.description }}</td>
              <td>
                <a v-if="item.piece_jointe" :href="'http://localhost:3000/uploads/' + item.piece_jointe" target="_blank" class="link-pj">
                  Voir fichier
                </a>
                <span v-else style="color: #ccc;">Aucune</span>
              </td>
              <td>
                <span :class="['status-badge', 'status-' + (item.statut ? item.statut.toLowerCase() : 'ouvert')]">
                  {{ formatStatusLabel(item.statut) }}
                </span>
              </td>
              <td>
                <span :class="['badge', 'priority-' + item.priorite?.toLowerCase()]">{{ item.priorite }}</span>
              </td>
              <td>
                <router-link :to="'/report/' + item.id" class="btn-action"> Traiter </router-link></td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
  <Footer/>
</template>