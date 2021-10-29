<template>
  <v-app id="app">
    
    <SiteNav></SiteNav>
    <router-view/>
    <!-- <HelloWorld /> -->
  </v-app>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
import SiteNav from '@/components/SiteNav'
export default {
  name: "App",
  components: {
    // HelloWorld,
    SiteNav
  }
};
</script>

<style>
</style>
