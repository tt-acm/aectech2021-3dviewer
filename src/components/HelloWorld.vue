<template>
  <div>
    <div id="threeContainer">
      <Three />
    </div>

    <div class="text-center">
      <v-dialog
        v-model="showNewModelDialog"
        width="500"
      >
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Upload a New Model
          </v-card-title>

          <v-card-text>
            <v-text-field
              v-model="newModelName"
              label="Model Name"
              prepend-icon="mdi-format-text-variant-outline"
              required
            ></v-text-field>

            <v-file-input
              v-model="files"
              placeholder="Upload a model"
              label="File input"
              multiple
              prepend-icon="mdi-paperclip"
              style="margin-top:25px"
            >
              <template v-slot:selection="{ text }">
                <v-chip
                  small
                  label
                  color="primary"
                >
                  {{ text }}
                </v-chip>
              </template>
            </v-file-input>        
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="showNewModelDialog = false;submitFiles()"
              :disabled="!newModelName || files.length < 1"
            >
              Upload!
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-btn
      color="primary"
      @click="showNewModelDialog = true"
    >
      Upload a New Model
    </v-btn>
    <v-btn
      color="secondary"
      @click="loadNewModel = true"
    >
      Load Existing Models
    </v-btn>
  </div>
</template>

<script>
import Three from "./Three.vue";
import { mapState } from 'vuex'

export default {
  components: {
    Three
  },
  data() {
    return {
      files: [],
      newModelName: null,
      showNewModelDialog: false
    };
  },
  computed: {
    ...mapState(['fbStorage', 'fbDB'])
  },
  mounted() {
  },
  methods: {
    submitFiles() {
      this.fbStorage.child('models/' +  this.files[0].name).put(this.files[0])
      .then(snapshot => {
          this.fbDB.collection('models').add({
            name: this.newModelName,
            modelUrl: snapshot.ref.fullPath            
          }).then((docRef) => {
              console.log("Document written with ID: ", docRef.id);
              this.newModelName = null;
              this.files = [];
          })
          .catch((error) => {
              console.error("Error adding document: ", error);
          });
      });
    }
    // runCheck() {
    //   console.log("Making request");
    //   fetch("/api/test")
    //     .then(data => data.text())
    //     .then(res => (this.msg = res));
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#threeContainer {
  height: 600px;
  width: 100%;
}
</style>
