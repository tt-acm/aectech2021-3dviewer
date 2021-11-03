<template>
  <div>    
    <v-system-bar height="60">
      <div style="z-index: 120; right: 10px; position: absolute;">
        <v-btn color="success" @click="toggleLogin()">
          Login {{loggedIn}}
        </v-btn>

      </div>      
    </v-system-bar>

  </div> 
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
        loggedIn: false
    };
  },
  mounted() {  
  },
  computed: {    
    ...mapState(['user'])  
  },
  methods: {
    toggleLogin() {
        this.loggedIn = !this.loggedIn;
        this.$store.commit("setUserProfile", this.loggedIn);
    }
  },
  filters: {
  }
}
</script>