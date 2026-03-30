<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue'
import Footer from '@/components/Footer.vue'
import { ref, onMounted } from 'vue'

const user = JSON.parse(localStorage.getItem('user') || '{}')
const reports = ref<any[]>([])
const loading = ref(false)
const selectedFile = ref<File | null>(null)

// Objet unique pour le formulaire 
const form = ref({
  type: 'Harcèlement',
  description: '',
  isAnonymous: false
})

// Récupération des signalements personnels 
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

// Fonction d'envoi du signalement
const handleFormSubmit = async () => {
  if (!form.value.description) return alert("Veuillez remplir la description.");
  
  loading.value = true
  const formData = new FormData()
  
  // Debug console pour vérifier l'envoi
  console.log("Nom du user dans storage:", user.nom);
  console.log("Anonyme coché ?", form.value.isAnonymous);

  formData.append('type', form.value.type)
  formData.append('description', form.value.description)
  formData.append('userId', user.id)
  
  // LOGIQUE SÉCURISÉE : 
  // Si la case n'est pas cochée, on prend le nom. S'il n'y a pas de nom, on met l'email.
  let auteurValeur = 'Anonyme';
  if (form.value.isAnonymous === false) {
    auteurValeur = user.nom || user.email || 'Salarié'; 
  }

  formData.append('auteur', auteurValeur)

  if (selectedFile.value) {
    formData.append('file', selectedFile.value) 
  }

  try {
    const response = await fetch('http://localhost:3000/api/reports', {
      method: 'POST',
      body: formData 
    })

    if (response.ok) {
      alert("Signalement enregistré !");
      form.value.description = '';
      form.value.isAnonymous = false;
      selectedFile.value = null;
      await fetchMyReports(); 
    } else {
      alert("Erreur lors de l'envoi.");
    }
  } catch (err) {
    console.error("Erreur technique :", err)
  } finally {
    loading.value = false
  }
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

onMounted(fetchMyReports)
</script>

<template>
  <div class="app-layout">
    <MainHeader />

    <main class="page-content">
      <div class="stats-grid" style="grid-template-columns: 1fr 1.5fr; align-items: start; gap: 2rem;">
        
        <section class="stat-card">
          <h2 style="font-size: 1.1rem; margin-bottom: 1.5rem; color: var(--primary);">Déposer un signalement</h2>
          <form @submit.prevent="handleFormSubmit">
            <div class="form-group">
              <label>Catégorie du signalement</label>
              <select v-model="form.type" class="input-field">
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
                placeholder="Décrivez précisément les faits (lieux, dates, témoins...)"
                class="input-field"
                style="min-height: 150px; resize: vertical;">
              </textarea>
            </div>

            <div class="form-group">
              <label>Pièce jointe (Optionnel)</label>
              <input type="file" @change="handleFileChange" accept=".jpg,.png,.pdf" class="input-field" style="padding: 5px;">
            </div>

            <div class="form-group" style="flex-direction: row; align-items: center; gap: 10px; margin-top: 10px;">
              <input type="checkbox" v-model="form.isAnonymous" id="anon" style="width: 20px; height: 20px; cursor: pointer;">
              <label for="anon" style="margin: 0; font-weight: 600; color: var(--text-dark); cursor: pointer;">
                Rester anonyme pour ce signalement
              </label>
            </div>

            <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1.5rem;" :disabled="loading">
              {{ loading ? 'Envoi en cours...' : 'Soumettre le signalement' }}
            </button>
          </form>
        </section>

        <section class="table-container">
          <div style="padding: 1.25rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
            <h2 style="font-size: 1rem; font-weight: 700;">Suivi de mes dossiers</h2>
            <span class="badge rh">{{ reports.length }} dossier(s)</span>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Code de suivi</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in reports" :key="item.id">
                <td><code class="tracking-code">{{ item.code_suivi }}</code></td>
                <td><strong>{{ item.type }}</strong></td>
                <td>
                  <span :class="['status-badge', 'status-' + (item.statut ? item.statut.toLowerCase() : 'ouvert')]">
                    {{ formatStatusLabel(item.statut) }}
                  </span>
                </td>
                <td>
                  <router-link :to="'/report/' + item.id" class="btn-action" style="text-decoration: none; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 5px;">
                    Discussion
                  </router-link>
                </td>
              </tr>
              
              <tr v-if="reports.length === 0">
                <td colspan="4" style="text-align: center; color: var(--text-light); padding: 3rem;">
                  <div style="font-size: 2rem; margin-bottom: 10px;">📁</div>
                  Aucun signalement déposé pour le moment.
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* Petit correctif pour l'affichage de la grille sur mobile */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: 1fr !important;
  }
}

/* On force l'alignement à gauche pour les titres ET les données */
th, td {
  text-align: left !important;
  vertical-align: middle; /* Pour que tout soit bien centré en hauteur */
  padding: 1rem 1.5rem;   /* Un peu plus d'espace sur les côtés pour respirer */
}

/* On s'assure que les badges et boutons ne décalent pas tout */
td .status-badge, 
td .btn-action, 
td .tracking-code {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Optionnel : fixe une largeur minimale pour la colonne Action 
   pour éviter que le titre "ACTION" ne flotte trop loin */
th:last-child, td:last-child {
  width: 150px;
}
</style>