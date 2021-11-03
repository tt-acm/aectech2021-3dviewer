import Vue from "vue";
import App from "./App.vue";
import store from './store';
// Setup Vuetify
import vuetify from './plugins/vuetify' // path to vuetify export
import {auth} from './firebase';

Vue.config.productionTip = false;

let app = new Vue({
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setUserProfile', user);    
  }
})
