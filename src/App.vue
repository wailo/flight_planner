<template>
  <div class="app">
    <h1>Demo</h1>
    <Map />
    <Demo />
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld";
import Demo from "@/components/Demo";
import Map from "@/components/Map";
export default {
  name: "App",
  components: { HelloWorld, Demo, Map },
  data() {
    return {};
  }
};
</script>
<style scoped>
h1 {
  color: white;
}
.app {
  background: rgba(27, 27, 27, 0.932);
}

* {
  margin: 0;
  padding: 0;
}
</style>
