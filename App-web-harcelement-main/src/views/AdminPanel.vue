<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MainHeader from '@/components/MainHeader.vue'
import Footer from '@/components/Footer.vue'

const activeTab = ref('users') // 'users' ou 'logs'
const users = ref<any[]>([])
const logs = ref<any[]>([])
const loading = ref(false)

const newUser = ref({ nom: '', email: '', password: '', role: 'SALARIE' })

// Charger les données
const fetchData = async () => {
  loading.value = true
  const userRes = await fetch('http://localhost:3000/api/admin/users')
  const logRes = await fetch('http://localhost:3000/api/admin/logs')
  
  const uData = await userRes.json()
  const lData = await logRes.json()
  
  if (uData.success) users.value = uData.data
  if (lData.success) logs.value = lData.data
  loading.value = false
}

// Créer un utilisateur
const handleCreateUser = async () => {
  const res = await fetch('http://localhost:3000/api/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser.value)
  })
  const data = await res.json()
  if (data.success) {
    alert("Compte créé !")
    newUser.value = { nom: '', email: '', password: '', role: 'SALARIE' }
    fetchData()
  }
}
  const toggleStatus = async (user: any) => {
    const newStatus = user.actif ? 0 : 1;
    const res = await fetch(`http://localhost:3000/api/admin/users/${user.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actif: newStatus })
    });
    if (res.ok) fetchData(); // On rafraîchit la liste
  };

  const confirmDelete = async (id: number) => {
    if (confirm("Es-tu sûr de vouloir supprimer définitivement ce compte ?")) {
      const res = await fetch(`http://localhost:3000/api/admin/users/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchData();
    }
  };

onMounted(fetchData)
</script>

<template>
  <div class="admin-page">
    <MainHeader />
    
    <main class="page-content">
      <header class="admin-nav">
        <button @click="activeTab = 'users'" :class="{ active: activeTab === 'users' }">Gestion Utilisateurs</button>
        <button @click="activeTab = 'logs'" :class="{ active: activeTab === 'logs' }">Journal d'Audit</button>
      </header>

      <div v-if="activeTab === 'users'" class="admin-grid">
        <section class="stat-card">
          <h3>➕ Nouveau Compte</h3>
          <form @submit.prevent="handleCreateUser" class="form-grid">
            <div class="form-group">
              <label>Nom</label>
              <input v-model="newUser.nom" type="text" required placeholder="Nom complet">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="newUser.email" type="email" required placeholder="test@entreprise.fr">
            </div>
            <div class="form-group">
              <label>Mot de passe</label>
              <input v-model="newUser.password" type="password" required>
            </div>
            <div class="form-group">
              <label>Rôle</label>
              <select v-model="newUser.role" class="input-field">
                <option value="USER">Salarié (User)</option>
                <option value="RH">Ressources Humaines (RH)</option>
                <option value="JURISTE">Juriste</option>
                <option value="ADMIN">Administrateur (Admin)</option>
              </select>
            </div>
            <button class="btn-primary btn-block">Créer l'accès</button>
          </form>
        </section>

        <section class="table-container">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Création</th>
              </tr>
            </thead>
            <tbody>
              
              <tr v-for="u in users" :key="u.id" :class="{ 'user-disabled': !u.actif }">
              <td><strong>{{ u.nom }}</strong></td>
              <td>{{ u.email }}</td>
              <td><span :class="['badge', u.role.toLowerCase()]">{{ u.role }}</span></td>
              <td class="actions">
                <button @click="toggleStatus(u)" :class="u.actif ? 'btn-warn' : 'btn-success'">
                  {{ u.actif ?  'Désactiver' : 'Activer' }}
                </button>
                
                <button @click="confirmDelete(u.id)" class="btn-danger">Supprimer</button>
              </td>
            </tr>
              
            </tbody>
          </table>
        </section>
      </div>

      <div v-else class="table-container">
        <div class="log-header">
          <h3>Traçabilité des actions</h3>
          <button @click="fetchData" class="btn-action">Actualiser</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Action</th>
              <th>Détails</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td class="date-cell">{{ new Date(log.date_action).toLocaleString() }}</td>
              <td><span class="log-tag">{{ log.action }}</span></td>
              <td class="details-cell">{{ log.details }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
  <Footer />
</template>

<style scoped>

</style>