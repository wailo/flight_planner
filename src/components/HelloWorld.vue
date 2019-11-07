<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>A descision making aid tool for pilot and airlines</p>
    <h1>What is it</h1>
    <ul>
      <li>These points are subject to disruption due to weather, closures, diversion etc..</li>
      <li>When a disruption happens, The pilot/airline are not informed until approaching the point, which is leads to diversions that is not optimal</li>
      <li>SWIM navigator provides a mean to detect this changes using external data sources and inform the pilot/airlines ahead of time, or provide and alternatives.</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
  }
a {
  color: #42b983;
}
</style>
