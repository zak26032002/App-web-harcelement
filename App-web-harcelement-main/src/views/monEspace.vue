<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue'
import { ref, onMounted } from 'vue'

const user = JSON.parse(localStorage.getItem('user') || '{}')
const reports = ref<any[]>([])
const loading = ref(false)
const selectedFile = ref<File | null>(null)

// Objet unique pour le formulaire [cite: 41]
const form = ref({
  type: 'Harcèlement',
  description: '',
  isAnonymous: false
})

// Récupération des signalements personnels [cite: 21, 42]
const fetchMyReports = async () => {
  if (!user.id) return console.error("ID utilisateur manquant");
  try {
    const response = await fetch(`http://localhost:3000/api/reports/my-reports?userId=${user.id}`)
    const result = await response.json()
    if (result.success) reports.value = result.data
  } catch (err) {
    console.error("Erreur connexion backend :", err)
  }
}

const handleFileChange = (event: any) => {
  selectedFile.value = event.target.files[0]
}

// Fonction unique d'envoi utilisant FormData [cite: 25, 41]
const handleFormSubmit = async () => {
  if (!form.value.description) return alert("Veuillez remplir la description.");
  
  loading.value = true
  const formData = new FormData()
  formData.append('type', form.value.type)
  formData.append('description', form.value.description)
  formData.append('userId', user.id)
  formData.append('isAnonymous', String(form.value.isAnonymous)) // [cite: 45, 59]

  if (selectedFile.value) {
    formData.append('file', selectedFile.value) // Envoi de la pièce jointe 
  }

  try {
    const response = await fetch('http://localhost:3000/api/reports', {
      method: 'POST',
      body: formData // Pas de JSON.stringify ici !
    })

    if (response.ok) {
      alert("Signalement enregistré ! Un code de suivi a été généré.") // [cite: 42, 46]
      form.value.description = ''
      selectedFile.value = null
      await fetchMyReports() // Actualisation de la liste [cite: 21]
    } else {
      alert("Erreur lors de l'envoi.")
    }
  } catch (err) {
    console.error("Erreur technique :", err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchMyReports)

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

    <div class="stats-grid" style="grid-template-columns: 1fr 1.5fr; align-items: start;">
      
      <section class="stat-card">
        <h2 style="font-size: 1.1rem; margin-bottom: 1.5rem;">Déposer un signalement</h2>
        <form @submit.prevent="handleFormSubmit">
          <div class="form-group">
            <label>Catégorie du signalement</label>
            <select v-model="form.type" style="padding: 0.75rem; border-radius: 6px; border: 1px solid #e2e8f0;">
              <option>Harcèlement</option>
              <option>Discrimination</option>
              <option>Sécurité au travail</option>
              <option>Autre</option>
            </select>
          </div>

          <div class="form-group">
            <label>Description des faits</label>
            <textarea 
              v-model="form.description" 
              placeholder="Décrivez précisément les faits..."
              style="padding: 0.75rem; border-radius: 6px; border: 1px solid #e2e8f0; min-height: 120px; font-family: inherit;">
            </textarea>
          </div>

          <div class="form-group" style="flex-direction: row; align-items: center; gap: 10px;">
            <input type="checkbox" v-model="form.isAnonymous" id="anon" style="width: auto;">
            <label for="anon" style="margin: 0; font-weight: 500;">Dépôt anonyme </label>
            <label>Pièce jointe (Optionnel)</label>
            <input type="file" @change="handleFileChange" accept=".jpg,.png,.pdf" style="border: none; padding: 0;">
          </div>

          <button type="submit" class="btn-primary btn-block" :disabled="loading">
            {{ loading ? 'Envoi...' : 'Soumettre le signalement' }}
          </button>
        </form>
      </section>

      <section class="table-container">
        <div style="padding: 1rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between;">
          <h2 style="font-size: 1rem;">Suivi de mes dossiers</h2>
          <span class="user-role">{{ reports.length }} dossier(s)</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Code de suivi</th>
              <th>Type</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in reports" :key="report.id">
              <td><span class="badge" style="background: #f1f5f9; color: #475569;">#{{ report.id }}</span></td>
              <td style="font-weight: 500;">{{ report.type }}</td>
              <td>
                <span :class="['badge', 'status-' + (report.statut ? report.statut.toLowerCase() : 'ouvert')]">
                  {{ report.statut || 'OUVERT' }}
                </span>
              </td>
            </tr>
            <tr v-if="reports.length === 0">
              <td colspan="3" style="text-align: center; color: var(--text-light); padding: 2rem;">
                Aucun signalement déposé.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>