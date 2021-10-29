<template>
  <div>
    <div id="threeContainer">
      <Three ref="threeViewer" :gridVisibility="gridVisibility" @loading-complete="loadingCompleted"/>
    </div>

    <!-- Model Dialogs -->
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
            :headers="LoadingTableHeaders"
            :items="existingModels"
            :items-per-page="itemsPerPage"
            class="elevation-1"
          >
          <template v-slot:item.loadingAction="{ item }">
            <v-icon small @click="setCurrentModel(item)"> mdi-plus-circle</v-icon>
          </template>         
          </v-data-table>

          <v-progress-linear v-show="modelLoading" color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear>
          <v-divider></v-divider>
        </v-card>
      </v-dialog>

      <!-- Sharing Model Dialog -->
      <v-dialog v-model="showSharingDialog" width="500">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Manage User Access
          </v-card-title>

          <v-card-text v-if="loadedModel">
            <v-switch v-model="loadedModel.isPublic" label="Allow Public Access?" ></v-switch>            
          </v-card-text>
         
          <v-progress-linear v-show="modelLoading" color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>            
            <v-btn color="primary" text @click="saveSharingSettings()"> Save </v-btn>            
          </v-card-actions>
        </v-card>
      </v-dialog>

    </div>

    <v-row style="margin:10px; position:absolute; left:0px; top:0px; z-index: 12;">
      <v-btn color="primary" @click="showNewModelDialog = true"> Upload a New Model </v-btn>
      <v-btn color="secondary" @click="launchModelLoader()" style="margin-left:20px; margin-right:20px" > Load Existing Models </v-btn>
      <v-btn class="mx-2" fab dark small color="indigo" @click="showSharingDialog=true" :disabled="!enableShare">
        <v-icon dark> mdi-share </v-icon>
      </v-btn>
    </v-row>

    <v-row style="margin:10px; position:absolute; left:0px; bottom:0px">
      <div class="d-flex">
        <div class="mx-2">
          <v-btn small dark fab color="primary" @click="zoomAll()">
            <v-icon dark>
              mdi-magnify
            </v-icon>
          </v-btn>
        </div>
        <div class="mx-2" style="width: 300px;">
          <v-slider
            thumb-label
            hint="Scale"
            min="0.1"
            max="100"
            @change="updateScale()"
          ></v-slider>
        </div>
        <div class="mx-2">
          <v-checkbox
            v-model="gridVisibility"
            dense
            label="Grid"
            color="grey"
            hide-details
            @change="updateGridVisibility()"
          ></v-checkbox>
        </div>
      </div>
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
      showSharingDialog:false,
      modelUploading: false,
      existingModels: [],
      LoadingTableHeaders:[
        { text: 'Model Name', value: 'name' },
        // { text: 'Directory', value: 'modelUrl' },        
        { text: 'Author', value: 'author' },        
        { text: 'Upload Date', value: 'uploaded' },
        { text: 'Actions', value: 'loadingAction', sortable: false },
      ],
      loadSingle: true,
      itemsPerPage:5,
      modelLoading: false,
      gridVisibility: true,
      enableShare:false
    };
  },
  computed: {
    ...mapState(['fbStorage', 'fbDB', "fbAuth", "user", "loadedModel"])
  },
  watch:{
    loadedModel(model) {
      console.log("model changed", model)      
      this.loadModel(model);   
      this.enableShare = true;
    }
  },
  mounted() {
    this.$refs.threeViewer.setGridVisibility(this.gridVisibility);
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
            author: this.user.displayName,
            isPublic: false,
            users:[{email: this.user.email}]            
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
            docData['_id'] = doc.id;
            this.existingModels.push(docData);
        });
        this.showModelLoaderDialog = true;
      });      
    },
    setCurrentModel(model) {
      if (!model) return;
      this.$store.commit("SetCurrentLoadedModel", model);
      this.showModelLoaderDialog = false;
    },
    loadModel(model) {
      if (!model) return;

      // this.$store.commit("SetCurrentLoadedModel", model);
      this.modelLoading = true
      var modelRef = this.fbStorage.child(model.modelUrl);
      // Get the download URL
      modelRef.getDownloadURL().then(url => {
        this.$refs.threeViewer.onBtnClickLoadModel(url);
      });
    },
    loadingCompleted(val) {
      this.modelLoading = false;
      this.showModelLoaderDialog = false;
    },
    zoomAll() {
      this.$refs.threeViewer.onBtnClickZoomAll();
    },
    updateScale() {
      this.$refs.threeViewer.updateScale();
    },
    updateGridVisibility() {
      this.$refs.threeViewer.setGridVisibility(this.gridVisibility);
    },
    saveSharingSettings() {
      // Update model's public access setting
      const modelRef = this.fbDB.collection("models").doc(this.loadedModel._id);
      modelRef.update({'isPublic': this.loadedModel.isPublic})
      this.showSharingDialog = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#threeContainer {
  position: absolute;
  left: 0px;
  top:0px;
  right:0px;
  bottom: 0px;
  z-index: 0;
}
</style>
