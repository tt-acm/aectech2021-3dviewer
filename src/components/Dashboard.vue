<template>
  <div>
    <div id="threeContainer">
      <Three ref="threeViewer" :gridVisibility="gridVisibility" @loading-complete="loadingCompleted"/>
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

            <!-- File Uploader -->
            <v-file-input
              v-model="filesForUpload"
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
              :disabled="!newModelName || filesForUpload.length < 1"
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
            Load Existing Model
          </v-card-title>

          <v-data-table
            :headers="LoadingTableHeaders"
            :items="existingModels"
            :items-per-page="itemsPerPage"
            class="elevation-1"
          >
          <template v-slot:item.isPublic="{ item }">
            <v-icon small v-if="item.isPublic"> mdi-check</v-icon>
          </template> 

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
            Manage Access
          </v-card-title>

          <v-card-text v-if="loadedModel">
            <v-switch v-model="loadedModel.isPublic" label="Make this model public?" ></v-switch>            
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
    
    <!-- UI for Viewer Settings -->
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
            v-model="scaleFactor"
            hint="Scale"
            min="0.1"
            max="100"
            @change="updateScale"
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

    <!-- Buttons for uploading/ loading/ sharing models -->
    <v-row style="margin:10px; position:absolute; left:0px; top:0px; z-index: 12;">
      <v-btn color="primary" @click="showNewModelDialog = true" :disabled="!user"> Upload a New Model </v-btn>
      <v-btn color="secondary" @click="launchModelLoader()" style="margin-left:20px; margin-right:20px" > Load Existing Models </v-btn>
      <v-btn class="mx-2" fab dark small color="indigo" @click="showSharingDialog=true" :disabled="!enableShare">
        <v-icon dark> mdi-share </v-icon>
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import Three from "./Three.vue";
import { mapState } from 'vuex';

export default {
  components: {
    Three
  },
  data() {
    return {
      gridVisibility: true,
      scaleFactor: 1,
      filesForUpload: [],
      newModelName: null,
      modelUploading: false,
      showNewModelDialog:false,
      showModelLoaderDialog: false,
      showSharingDialog: false,
      modelLoading: false,
      existingModels: [],
      LoadingTableHeaders:[
        { text: 'Model Name', value: 'name' },
        { text: 'Public', value: 'isPublic' },
        { text: 'Author', value: 'author.name' },        
        { text: 'Upload Date', value: 'uploaded' },
        { text: '', value: 'loadingAction', sortable: false },
      ],
      itemsPerPage:5,
      enableShare:false,
      loadedModel: null
    };
  },
  mounted() {
    this.$refs.threeViewer.setGridVisibility(this.gridVisibility);
  },
  computed: {
    ...mapState(['user', 'fbStorage', 'fbDB'])
  },
  methods: {
    loadingCompleted(val) {
      this.modelLoading = false;

      this.zoomAll(); //Zoom in after loading
    },
    zoomAll() {
      this.$refs.threeViewer.onBtnClickZoomAll();
    },
    updateScale() {
      this.$refs.threeViewer.updateScale(this.scaleFactor);
    },
    updateGridVisibility() {
      this.$refs.threeViewer.setGridVisibility(this.gridVisibility);
    },
    submitFiles() {
      // Upload model to storage and add a record in db.
      this.fbStorage.child('models/' +  this.filesForUpload[0].name).put(this.filesForUpload[0])
      .then(snapshot => {
          this.fbDB.collection('models').add({
            name: this.newModelName,
            modelUrl: snapshot.ref.fullPath,
            uploaded: new Date().toISOString(),
            author: {_id: this.user.uid, name: this.user.displayName},
            isPublic: false,
          }).then((docRef) => {
              console.log("Document written with ID: ", docRef.id);

              // File Uploaded, clear out old inputs
              this.newModelName = null;
              this.filesForUpload = [];
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
      this.showModelLoaderDialog = true; // Launch model loader popup

      if (this.user) {
        // If logged in, get user's model
        this.fbDB.collection('models').where('author._id', "==", this.user.uid).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              const docData = doc.data();
              docData['_id'] = doc.id;
              this.existingModels.push(docData);
          });
        });   
      }
        
      // Next, get all public models      
      this.fbDB.collection('models').where("isPublic", "==", true).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            docData['_id'] = doc.id;
            if (this.existingModels.map(m => m._id).indexOf(doc.id) < 0) {
              // Checked for duplicates
              this.existingModels.push(docData);
            }            
        });
      });  
    },
    setCurrentModel(model) {
      if (!model) return;
      this.loadModel(model);   
      this.enableShare = true;
      this.loadedModel = model
    },
    loadModel(model) {
      if (!model) return;

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
      this.zoomAll(); //Zoom in after loading
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
</style>
