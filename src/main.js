import Vue from "vue";
import App from "./App.vue";
import vuetify from '@/plugins/vuetify' // path to vuetify export
import router from './router'
import store from './store'
import { auth } from './firebase'

Vue.config.productionTip = false;

// new Vue({
//   render: (h) => h(App),
// }).$mount("#app");
let app
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }

  if (user) {
    store.dispatch('fetchUserProfile', user)
  }
})