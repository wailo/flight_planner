<template>
  <div class="app">
    <Map />
    <FlightsMenu v-bind:flightplans="flightPlans" />
    <!-- <Demo /> -->
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld";
import Demo from "@/components/Demo";
import Map from "@/components/Map";
import FlightsMenu from "@/components/FlightsMenu";

export default {
  name: "App",
  components: { HelloWorld, Demo, Map, FlightsMenu },
  data() {
    return {};
  },
  computed: {
    flightPlans() {
      return this.$store.state.flightPlans;
    }
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
