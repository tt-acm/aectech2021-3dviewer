<template>
  <div id="dashboard">
    hello
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    
  },
  filters: {
  }
}
</script>

<style lang="scss" scoped>

</style>
