<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const user = JSON.parse(localStorage.getItem('user') || '{}')
const report = ref<any>(null)
const comments = ref<any[]>([])
const newMessage = ref('')
const selectedStatus = ref('')
const loading = ref(false)

const loadData = async () => {
  const res = await fetch(`http://localhost:3000/api/reports/${route.params.id}`)
  const data = await res.json()
  if (data.success) {
    report.value = data.report
    comments.value = data.comments
    selectedStatus.value = data.report.statut
  }
}

const saveChanges = async () => {
  loading.value = true;
  try {
    // 1. Mise à jour du statut en BDD
    const response = await fetch(`http://localhost:3000/api/reports/${route.params.id}/status`, {
      method: 'PATCH', // Correspond à router.patch dans ton reportRoutes.js
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut: selectedStatus.value })
    });

    const result = await response.json();

    if (result.success) {
      // 2. Envoi du commentaire (réponse) si le champ n'est pas vide
      if (newMessage.value) {
        await fetch(`http://localhost:3000/api/reports/${route.params.id}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ auteur_nom: user.nom, message: newMessage.value })
        });
        newMessage.value = ''; // Réinitialise le champ
      }

      alert("Modifications enregistrées avec succès !");
      await loadData(); // Recharge les données pour voir le nouveau statut et le message
    }
  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err);
    alert("Impossible de mettre à jour le dossier.");
  } finally {
    loading.value = false;
  }
};

onMounted(loadData)
</script>

<template>
  <div class="page-content" v-if="report">
    <div class="stat-card">
      <h2>Signalement #{{ report.code_suivi }}</h2>
      <p><strong>Type :</strong> {{ report.type }}</p>
      <div class="description-box">{{ report.description }}</div>
    </div>

    <div class="table-container" style="margin-top: 20px; padding: 20px;">
      <h3>Échanges et Décisions</h3>
      <div v-for="c in comments" :key="c.id" class="comment">
        <strong>{{ c.auteur_nom }}</strong> <small>{{ new Date(c.date_publication).toLocaleString() }}</small>
        <p>{{ c.message }}</p>
      </div>

      <hr />
      <div class="form-group">
        <label>Votre réponse :</label>
        <textarea v-model="newMessage" class="input-field"></textarea>
      </div>

      <div class="form-group">
        <label>Changer le statut :</label>
        <select v-model="selectedStatus">
          <option value="OUVERT">OUVERT</option>
          <option value="EN_COURS">EN_COURS</option>
          <option value="CLOS_FONDE">CLOS_FONDE</option>
          <option value="CLOS_NON_FONDE">CLOS_NON_FONDE</option>
        </select>
      </div>

      <button @click="saveChanges" class="btn-primary">Enregistrer les modifications</button>
    </div>
  </div>
</template>