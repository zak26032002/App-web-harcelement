<template>
  <div class="report-list">
    <h1>Report List</h1>
    <ul v-if="reports.length > 0">
      <li v-for="report in reports" :key="report.id">
        {{ report.title }} - {{ report.status }}
      </li>
    </ul>
    <p v-else>No reports available.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Define a basic report interface (adjust as needed)
interface Report {
  id: number
  title: string
  status: string
}

// Sample data (replace with actual data fetching logic)
const reports = ref<Report[]>([
  { id: 1, title: 'Report 1', status: 'Pending' },
  { id: 2, title: 'Report 2', status: 'Resolved' }
])
</script>

<style scoped>
.report-list {
  padding: 20px;
}
</style>