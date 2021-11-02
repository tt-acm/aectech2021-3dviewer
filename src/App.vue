<template>
  <v-app id="app">
    <SiteNav />
    <Dashboard />
    
  </v-app>
</template>

<script>
import Dashboard from "./components/Dashboard.vue";
import SiteNav from './components/SiteNav.vue';

export default {
  name: "App",
  components: {
    Dashboard,
    SiteNav
  }
};
</script>

<style>
</style>
