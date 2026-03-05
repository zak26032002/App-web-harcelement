// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import DashboardView from '../views/Dashboard.vue'
import ReportsList  from '../views/ReportsList.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: LoginView },
    { path: '/dashboard', component: DashboardView },
    { path: '/reports', component: ReportsList }
  ]
})
export default router