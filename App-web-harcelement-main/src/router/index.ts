// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import DashboardView from '../views/Dashboard.vue'
import SignalementAction  from '../views/SignalementAction.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: LoginView },
    { path: '/dashboard', component: DashboardView },
    { path: '/ProcessReport', component: SignalementAction },
    { path: '/login', component: LoginView },
    { path: '/reports', component: () => import('../views/ReportList.vue') },
    
    {
      path: '/signalement/:id', 
      name: 'details',
      component: () => import('../views/SignalementAction.vue')
      },
      
    {
      path: '/mon-espace',
      name: 'monEspace',
      component: () => import('../views/monEspace.vue')
    },
    {
      path: '/report/:id',
      name: 'report',
      component: () => import('../views/ReportDetail.vue')
    },
    {
      path : '/admin',
      name: 'admin',
      component: () => import('../views/AdminPanel.vue')
    }
    
  ]
})
export default router