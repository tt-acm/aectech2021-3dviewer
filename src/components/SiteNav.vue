<template>
  <div>    
      <div style="z-index: 12;top: 10px;right: 10px; position: absolute;">
        <v-btn color="success">
          Login
        </v-btn>

        
      </div>      

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