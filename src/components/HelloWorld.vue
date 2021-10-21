<template>
  <div>
    <img :src="'/imgs/img.png'" />
    <h1>HelloWorld</h1>
    <div>
      <p>Test your backend connection.</p>
      <input type="button" value="Check" @click="runCheck" />
      <p>{{ msg }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: ""
    };
  },
  methods: {
    runCheck() {
      console.log("Making request");
      fetch("/api/test")
        .then(data => data.text())
        .then(res => (this.msg = res));
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
