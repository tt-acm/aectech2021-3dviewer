<template>
  <div id="app">
    
    <SiteNav></SiteNav>
    <!-- <router-view/> -->
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import SiteNav from '@/components/SiteNav'
export default {
  name: "App",
  components: {
    HelloWorld,
    SiteNav
  }
};
</script>

<style>
</style>
