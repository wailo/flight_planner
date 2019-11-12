<template>

  <div class="home">    
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld id='d1' msg="Welcome to Your Vue.js App"/>
    <h1 id='d2'>Demo</h1>
    <Demo> </Demo>
  
  </div>
</template>



<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Demo from '@/components/Demo.vue'

export default {
  name: 'home',
  components: {
    HelloWorld,
    Demo,
  }
}
</script>

<style scoped>


</style>