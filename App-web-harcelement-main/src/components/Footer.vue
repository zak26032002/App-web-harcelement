<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="main-footer">
    <div class="footer-container">
      <div class="footer-brand">
        <div class="footer-logo">
          <span class="logo-icon">⚖️</span>
          <span class="logo-text">Signalements <strong>Internes</strong></span>
        </div>
        <p class="mission-text">
          Solution conforme aux exigences de protection des lanceurs d'alerte et de traçabilité des échanges.
        </p>
      </div>

      <div class="footer-info">
        <h5>Sécurité & Conformité</h5>
        <ul class="info-list">
          <li><span class="status-dot"></span> Anonymat optionnel et garanti </li>
          <li><span class="status-dot"></span> Journal d'audit inaltérable </li>
        </ul>
      </div>

      <div class="footer-help">
        <h5>Assistance</h5>
        <p>Pour toute question sur la procédure de signalement, contactez votre <strong>Référent Conformité</strong>.</p>
      </div>
    </div>

    <div class="footer-bar">
      <div class="bar-content">
        <p>&copy; {{ currentYear }} — Portail Interne RH/Juriste</p>
        <div class="meta-links">
          <span class="version-tag">Version 1.0 (Demo)</span>
          <span class="divider">|</span>
          <span class="encryption-tag">Chiffrement TLS actif</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>

</style>