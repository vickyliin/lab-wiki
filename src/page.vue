<template>
  <main>
    <v-container>
      <h5 class="mb-4">{{title | spaceSeparated}}</h5>
      <router-view></router-view>
    </v-container>
  </main>
</template>
<script>

  import * as components from './pages/*.vue'

  export default{
    data(){return{
      get title(){return window.location.pathname.slice(1)}
    }},
    components
  }

</script>

<style lang="stylus">
  main>.container
    padding: 2.5rem 2rem
</style>