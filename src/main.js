import Vue from "vue";
import App from "./App.vue";
import vuetify from './plugins/vuetify' // path to vuetify export
import store from './store'
import { auth } from './firebase'

Vue.config.productionTip = false;

let app
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }

  if (user) {
    store.commit('setUserProfile', user);    
  }
})