<template>
  <header>
    <v-system-bar height="39">
      <v-btn depressed >Login</v-btn>
    </v-system-bar>
  </header>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>
