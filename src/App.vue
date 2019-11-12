<template>
  <div>
    <link rel="stylesheet" type="text/css" href="fullpage.css" />
    <full-page ref="fullpage" :options="options" navigation="true" id="fullpage">
      <div class="section">
        <h1>Just Title</h1>
      </div>

      <div class="section">
        <h1>Navigator</h1>
        <p>A descision making aid tool for pilot and airlines</p>
      </div>

      <div class="section">
        <h1>What is it</h1>
        <ul>
          <li>These points are subject to disruption due to weather, closures, diversion etc..</li>
          <li>When a disruption happens, The pilot/airline are not informed until approaching the point, which is leads to diversions that is not optimal</li>
          <li>SWIM navigator provides a mean to detect this changes using external data sources and inform the pilot/airlines ahead of time, or provide and alternatives.</li>
        </ul>
      </div>
      <div class="section">
        <h1>Demo</h1>
        <Demo />
      </div>
    </full-page>
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
      options: {
        menu: "#menu",
        anchors: ["page1", "page2", "page3", "page4"],
        sectionsColor: ["#202020", "#202020", "#202020", "#202020"]
      }
    };
  }
}; 
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
.section {
  text-align: center;
  color: aliceblue;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
}

h1 {
    font-size: 6em;
    text-align: center;
    color: #fff;
    font-weight: 700;
}



</style>
