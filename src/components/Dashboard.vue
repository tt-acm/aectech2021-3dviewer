<template>
  <div>
    <div id="threeContainer">
      <Three ref="threeViewer" :gridVisibility="gridVisibility" />
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
      scaleFactor: 1
    };
  },
  mounted() {
    this.$refs.threeViewer.setGridVisibility(this.gridVisibility);
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    zoomAll() {
      this.$refs.threeViewer.onBtnClickZoomAll();
    },
    updateScale() {
      this.$refs.threeViewer.updateScale(this.scaleFactor);
    },
    updateGridVisibility() {
      this.$refs.threeViewer.setGridVisibility(this.gridVisibility);
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
