<template>
  <nav v-if="$route.path !== '/'"> <RouterLink to="/dashboard">Tableau de bord</RouterLink>
  </nav>

  <RouterView />
</template>

<style>
/* Style global pour éviter les marges blanches */
body { margin: 0; padding: 0; }
</style>