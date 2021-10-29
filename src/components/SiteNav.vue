<template>
  <div>    
    <v-system-bar height="60">
      <div style="z-index: 12; right: 10px; position: absolute;">
        <v-btn v-show="!user" @click="showLoginOptions = !showLoginOptions" color="success">
          Login
        </v-btn>

        <!-- Authoration Dropdown -->
        <v-menu v-if="user" open-on-hover offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon>
              <!-- Create a red circle with initials after login -->
              <v-avatar color="red">
                <span class="white--text text-h5">{{user.displayName | getNameInitials}}</span>
              </v-avatar>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title> <a @click="signoutButtonPressed">Logout </a> </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>      
    </v-system-bar>

    <!-- Firebase Login UI -->
    <section
      v-show="showLoginOptions"
      id="firebaseui-auth-container"
      style="
        position: absolute;
        right: 0px;
        top: 50px;
        text-align: center;
        z-index: 10;
      "
    ></section>  
      
  </div> 
</template>

<script>
import { mapState } from 'vuex'
import firebase from 'firebase/app';

export default {
  data() {
    return {
      showLoginOptions: false,
    };
  },
  mounted() {
    var uiConfig = {
        signInSuccessUrl: "/",
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ]
    };
    this.loginUI.start("#firebaseui-auth-container", uiConfig);    
  },
  computed: {      
    ...mapState(['user', 'loginUI'])
  },
  methods: {
    signoutButtonPressed(e) {
      firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("Sign-out successful");
        this.$store.commit('setUserProfile', null)
      }).catch((error) => {
        // An error happened.
      });
    }
  },
  filters: {
    getNameInitials: function (value) {
      if (!value) return ''      
      return value.split(" ").map(w => w[0].toUpperCase()).join("")
    }
  }
}
</script>
