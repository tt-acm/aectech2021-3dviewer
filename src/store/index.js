import Vue from 'vue';
import Vuex from 'vuex';
import * as fb from '../firebase';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        user: null,
        loginUI: fb.ui,
        fbAuth: fb.auth,
        fbStorage: fb.storage,
        fbDB: fb.db,
        firebase: fb.firebase
    },
    mutations: {
      setUserProfile(state, val) {
          console.log("setting user", val);
        state.user = val
      }
    },
    actions: {  
    }
})
  
export default store;