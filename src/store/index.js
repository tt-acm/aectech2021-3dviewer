import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
      userProfile: null,
      loginUI: fb.ui,
      fbAuth: fb.auth,
      fbStorage: fb.storage,
      fbDB: fb.db
    },
    mutations: {
      setUserProfile(state, val) {
        state.userProfile = val
      }
    },
    actions: {  
    }
  })
  
  export default store