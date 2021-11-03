<template>
<div>  
    <div style="z-index: 12;top: 10px;right: 10px; position: absolute;">
        <!-- Login button -->
        <v-btn v-show="!user" @click="showLoginOptions = !showLoginOptions" color="success">
          Login
        </v-btn>

        <!-- User avatar after login -->
        <v-menu v-if="user" open-on-hover offset-y>
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon>
                    <v-avatar color="red">
                        <span class="white--text text-h5">{{user.displayName | getNameInitials}}</span>
                    </v-avatar>
                </v-btn>
            </template>

            <!-- Dropdown for logout -->
            <v-list>
                <v-list-item>
                    <v-list-item-title>
                        <a @click="signoutButtonPressed">Logout </a>                
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>   

    <!-- Firebase login options ui -->
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
import { mapState } from 'vuex';

export default {
  data() {
    return {
        showLoginOptions: false, // controls the visibility of login options ui
    };
  },
  mounted() {  
    console.log("user", this.user);
    var uiConfig = {
        // signInSuccessUrl: "/",
        signInOptions: [
          this.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ]
    };
    this.loginUI.start("#firebaseui-auth-container", uiConfig); 
  },
  computed: {    
    ...mapState(['user', 'firebase', 'loginUI', 'fbAuth'])  
  },
  methods: {
    signoutButtonPressed(e) {
      this.fbAuth.signOut().then(() => {
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
        if (!value) return '';      
        return value.split(" ").map(w => w[0].toUpperCase()).join("");
    }
  }
}
</script>