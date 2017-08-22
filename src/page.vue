<template>
  <main>
    <transition name="slide-y" mode="out-in" appear>
      <v-container fluid :key="title">
        <h5 class="mb-4">{{title | spaceSeparated}}</h5>
        <router-view class="fluid"></router-view>
      </v-container>
    </transition>
  </main>
</template>
<script>

  import * as components from './pages/*.vue'

  export default{
    components,
    computed: {
      title(){
        return this.$route.fullPath.slice(1)
      }
    }
  }

</script>

<style lang="stylus">
  main>.container
    padding: 2.5rem 2rem
</style>