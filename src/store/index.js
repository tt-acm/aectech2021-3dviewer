import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
      user: null,
      loadedModel: null,
      loginUI: fb.ui,
      fbAuth: fb.auth,
      fbStorage: fb.storage,
      fbDB: fb.db      
    },
    mutations: {
      setUserProfile(state, val) {
        state.user = val
      },
      SetCurrentLoadedModel(state, val) {
        state.loadedModel = val;
      }
    },
    actions: {  
    }
  })
  
  export default store