<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const user = JSON.parse(localStorage.getItem('user') || '{}')
const report = ref<any>(null)
const comments = ref<any[]>([])
const newMessage = ref('')
const selectedStatus = ref('')
const loading = ref(false)

// Vérification du rôle pour l'affichage
const isRH = user.role === 'RH' || user.role === 'JURISTE' || user.role === 'ADMIN'

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
  if (!newMessage.value && isRH && selectedStatus.value === report.value.statut) return;
  
  loading.value = true;
  try {
    // 1. MISE À JOUR DU STATUT (Seulement si RH et si le statut a changé)
    if (isRH && selectedStatus.value !== report.value.statut) {
      await fetch(`http://localhost:3000/api/reports/${route.params.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: selectedStatus.value })
      });
    }

    // 2. ENVOI DU COMMENTAIRE (Salarié ou RH)
    if (newMessage.value.trim()) {
      // Gestion de l'anonymat dans le chat
      let nomAuteur = user.nom;
      if (!isRH && report.value.auteur === 'Anonyme') {
        nomAuteur = 'Salarié (Anonyme)';
      }

      await fetch(`http://localhost:3000/api/reports/${route.params.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          auteur_nom: nomAuteur, 
          message: newMessage.value 
        })
      });
      newMessage.value = ''; 
    }

    alert("Enregistré !");
    await loadData(); 
  } catch (err) {
    console.error("Erreur :", err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadData)
</script>

<template>
  <MainHeader />
  <div class="page-content" v-if="report">
    
    <div class="stat-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2>Signalement #{{ report.code_suivi }}</h2>
        <span :class="['status-badge', 'status-' + report.statut.toLowerCase()]">
          {{ report.statut }}
        </span>
      </div>
      <p style="margin-top: 10px;"><strong>Type :</strong> {{ report.type }}</p>
      <div class="description-box" style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 10px; border-left: 4px solid var(--primary);">
        {{ report.description }}
      </div>
    </div>

    <div class="table-container" style="margin-top: 20px; padding: 25px;">
      <h3>Discussion avec les référents</h3>
      
      <div class="chat-window" style="margin-top: 20px; background: #f1f5f9; padding: 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 15px;">
        
        <p v-if="comments.length === 0" style="text-align: center; color: var(--text-light);">
          Aucun échange pour le moment.
        </p>

        <div v-for="c in comments" :key="c.id" 
             :class="['message-bubble', c.auteur_nom === user.nom || (c.auteur_nom === 'Salarié (Anonyme)' && !isRH) ? 'sent' : 'received']">
          <div class="message-info" style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 5px; opacity: 0.8;">
            <strong>{{ c.auteur_nom }}</strong>
            <span>{{ new Date(c.date_publication).toLocaleTimeString() }}</span>
          </div>
          <p style="margin: 0; font-size: 0.95rem;">{{ c.message }}</p>
        </div>
      </div>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />

      <div class="reply-area">
        <div class="form-group">
          <label>Votre message :</label>
          <textarea v-model="newMessage" class="input-field" placeholder="Écrivez votre réponse ici..." style="min-height: 100px;"></textarea>
        </div>

        <div v-if="isRH" class="form-group" style="margin-top: 15px;">
          <label>Changer le statut du dossier :</label>
          <select v-model="selectedStatus" class="input-field">
            <option value="OUVERT">OUVERT</option>
            <option value="EN_COURS">EN COURS</option>
            <option value="EN_ATTENTE_INFO">EN ATTENTE D'INFOS</option>
            <option value="CLOS">CLOS (FONDÉ)</option>
            
          </select>
        </div>

        <button @click="saveChanges" class="btn-primary" :disabled="loading" style="margin-top: 10px; width: 100%;">
          {{ loading ? 'Envoi...' : (isRH ? 'Enregistrer les modifications' : 'Envoyer mon message') }}
        </button>
      </div>
    </div>
  </div>
</template>