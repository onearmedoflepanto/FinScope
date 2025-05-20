<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'

</script>

<template>
  <Navbar />
  <RouterView />
</template>

<style>
body {
  font-family: 'Nunito', sans-serif;
}
</style>