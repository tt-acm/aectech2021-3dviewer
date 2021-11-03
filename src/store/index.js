import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
      user: null
    },
    mutations: {
      setUserProfile(state, val) {
        state.user = val
      }
    },
    actions: {  
    }
  })
  
  export default store