<template>
  <div>
    <div id="threeContainer">
      <Three ref="threeViewer" @loading-complete="loadingCompleted"/>
    </div>

    <div class="text-center">
      <!-- New Model Upload Dialog -->
      <v-dialog v-model="showNewModelDialog" width="500">
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

          <v-progress-linear :active="modelUploading" indeterminate color="deep-purple accent-4" ></v-progress-linear>    
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>            
            <v-btn
              color="primary"
              text
              @click="submitFiles();modelUploading=true"
              :disabled="!newModelName || files.length < 1"
            >
              Upload!                       
            </v-btn>
            
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Load Existing Model Dialog -->
      <v-dialog v-model="showModelLoaderDialog" width="500">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Load Exist Model
          </v-card-title>

          <v-data-table
            :headers="tableHeaders"
            :items="existingModels"
            :items-per-page="itemsPerPage"
            class="elevation-1"
          >
          <template v-slot:item.actions="{ item }">
            <v-icon small @click="loadModel(item)"> mdi-plus-circle</v-icon>
          </template>         
          </v-data-table>

          <v-progress-linear v-show="modelLoading" color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear>
          <v-divider></v-divider>
        </v-card>
      </v-dialog>

    </div>

    <v-row style="margin:10px; position:absolute; left:0px; top:0px">
        <v-btn color="primary" @click="showNewModelDialog = true"> Upload a New Model </v-btn>
        <v-btn color="secondary" @click="launchModelLoader()" style="margin-left:20px" > Load Existing Models </v-btn>
    </v-row>
    
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
      showNewModelDialog: false,
      showModelLoaderDialog: false,
      modelUploading: false,
      existingModels: [],
      tableHeaders:[
        { text: 'Model Name', value: 'name' },
        // { text: 'Directory', value: 'modelUrl' },        
        { text: 'Author', value: 'author' },        
        { text: 'Upload Date', value: 'uploaded' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      loadSingle: true,
      itemsPerPage:5,
      modelLoading: false,
    };
  },
  computed: {
    ...mapState(['fbStorage', 'fbDB', "user"])
  },
  mounted() {
  },
  methods: {
    submitFiles() {
      // Upload model to storage and add a record in db.
      this.fbStorage.child('models/' +  this.files[0].name).put(this.files[0])
      .then(snapshot => {
          this.fbDB.collection('models').add({
            name: this.newModelName,
            modelUrl: snapshot.ref.fullPath,
            uploaded: new Date().toISOString(),
            author: this.user.displayName            
          }).then((docRef) => {
              console.log("Document written with ID: ", docRef.id);

              // File Uploaded, clear out old inputs
              this.newModelName = null;
              this.files = [];
              this.modelUploading = false;
              this.showNewModelDialog = false;
          })
          .catch((error) => {
              console.error("Error adding document: ", error);
          });
      });
    },
    launchModelLoader() {  
      this.existingModels = [];    
      this.fbDB.collection('models').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            this.existingModels.push(docData);
        });
        this.showModelLoaderDialog = true;
      });      
    },
    loadModel(model) {
      if (!model) return;
      this.modelLoading = true
      var starsRef = this.fbStorage.child(model.modelUrl);
      // Get the download URL
      starsRef.getDownloadURL().then(url => {
        this.$refs.threeViewer.onBtnClickLoadModel(url);
      });
    },
    loadingCompleted(val) {
      this.modelLoading = false;
      this.showModelLoaderDialog = false;
    }
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
