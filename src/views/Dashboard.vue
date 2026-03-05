<script setup lang="ts">
import { ref, computed } from 'vue'

// 1. On définit le type de nos données
interface Signalement {
  id: string;
  type: 'Harcèlement' | 'Discrimination' | 'Autre';
  date: string;
  statut: 'Nouveau' | 'En cours' | 'Clos';
  priorite: 'Basse' | 'Moyenne' | 'Haute' | 'Critique';
}

// 2. On type notre variable réactive
const signalements = ref<Signalement[]>([
  { id: 'SIG-001', type: 'Harcèlement', date: '2026-03-05', statut: 'Nouveau', priorite: 'Critique' },
  { id: 'SIG-002', type: 'Discrimination', date: '2026-03-04', statut: 'En cours', priorite: 'Moyenne' },
  { id: 'SIG-003', type: 'Harcèlement', date: '2026-03-01', statut: 'Clos', priorite: 'Basse' },
])

// 3. Exemple de propriété calculée typée
const casUrgentsCount = computed<number>(() => {
  return signalements.value.filter(s => s.priorite === 'Critique' && s.statut !== 'Clos').length
})

// 4. Fonction typée pour l'action
const traiterCas = (id: string): void => {
  console.log(`Traitement du cas : ${id}`)
  // Ici viendra la logique de navigation
}
</script>

<template>
  <div class="admin-layout">
    <main class="main-content">
      <header class="top-bar">
        <h1>Dashboard RH <small>(TS Mode)</small></h1>
        <div class="badge-urgent" v-if="casUrgentsCount > 0">
          {{ casUrgentsCount }} cas critique(s) à traiter !
        </div>
      </header>

      <section class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cas in signalements" :key="cas.id">
              <td>{{ cas.id }}</td>
              <td>{{ cas.type }}</td>
              <td><span :class="['badge', cas.statut.toLowerCase()]">{{ cas.statut }}</span></td>
              <td>
                <button @click="traiterCas(cas.id)" class="btn-action">Consulter</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Reprend les styles précédents */
.badge-urgent { background: #fee2e2; color: #dc2626; padding: 0.5rem; border-radius: 6px; font-weight: bold; }
/* ... reste du CSS ... */
</style>