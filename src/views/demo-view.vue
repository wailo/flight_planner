<template>
  <div class="demo">
    <h1>This is demo page page</h1>
    <Demo/>
  </div>
</template>


<script>
// @ is an alias to /src
import Demo from '@/components/Demo.vue'

export default {
  name: 'demo-view',
  components: {
    Demo
  }
}
</script>