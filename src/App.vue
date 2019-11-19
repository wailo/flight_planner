<template>
  <div class="app">
    <h1>Demo</h1>
        <Demo/>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld";
import Demo from "@/components/Demo";
export default {
  name: "App",
  components: { HelloWorld, Demo },
  data() {
    return {

    };
  }
}; 
</script>
<style>

.h1 {
  color: white;
}
.app {
  background: rgba(27, 27, 27, 0.932)

}
* {
  margin: 0;
  padding: 0;
}
</style>
