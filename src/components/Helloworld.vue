<script setup lang="ts">
const props = defineProps(['name', 'age']);

</script>

<template>
  
  <h1>
    Hello World
  </h1>
  <p>
    {{props.name}} {{props.age}}
  </p>

</template>

<style scoped>

</style>
