<template>
  <nav v-if="$route.path !== '/'"> 
  </nav>

  <RouterView />
</template>

<style>
/* Style global pour éviter les marges blanches */
body { margin: 0; padding: 0; }
</style>