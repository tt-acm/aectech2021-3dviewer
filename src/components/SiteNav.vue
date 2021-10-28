<template>
  <div>    
    <v-system-bar height="60">
      <div style="z-index: 12; right: 10px; position: absolute;">
        <v-btn v-show="!user" @click="showLoginOptions = !showLoginOptions" color="success">
          Login
        </v-btn>

        <v-menu v-if="user" open-on-hover offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon>
              <v-avatar color="red">
                <span class="white--text text-h5">{{user.displayName | getNameInitials}}</span>
              </v-avatar>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title>
                <a @click="signoutButtonPressed">Logout </a>                
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>      
    </v-system-bar>

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
import { auth } from '../firebase';

export default {
  data() {
    return {
      showLoginOptions: false,
    };
  },
  mounted() {
    console.log("user", this.user);
    // var ui = new firebaseui.auth.AuthUI(firebase.auth());
    var uiConfig = {
        signInSuccessUrl: "/",
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          // {
          //   provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          //   signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
          //   // Allow the user the ability to complete sign-in cross device,
          //   // including the mobile apps specified in the ActionCodeSettings
          //   // object below.
          //   forceSameDevice: false,
          //   // Used to define the optional firebase.auth.ActionCodeSettings if
          //   // additional state needs to be passed along request and whether to open
          //   // the link in a mobile app if it is installed.
          //   emailLinkSignIn: function() {
          //     return {
          //       // Additional state showPromo=1234 can be retrieved from URL on
          //       // sign-in completion in signInSuccess callback by checking
          //       // window.location.href.
          //       url: 'https://thread.thorntontomasetti.com/',
          //       // Custom FDL domain.
          //       dynamicLinkDomain: 'example.page.link',
          //       // Always true for email link sign-in.
          //       handleCodeInApp: true,
          //       // Whether to handle link in iOS app if installed.
          //       iOS: {
          //         bundleId: 'com.example.ios'
          //       },
          //       // Whether to handle link in Android app if opened in an Android
          //       // device.
          //       android: {
          //         packageName: 'com.example.android',
          //         installApp: true,
          //         minimumVersion: '12'
          //       }
          //     };
          //   }
          // }
        ]
    };
    this.loginUI.start("#firebaseui-auth-container", uiConfig);    
  },
  computed: {      
    ...mapState(['user', 'loginUI'])
  },
  methods: {
    signoutButtonPressed(e) {
      console.log("this.auth", auth)

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
