<template>
  <v-app dark>
    <navigator v-model="drawer"/>
    <toolbar v-model="drawer"/>
    <v-btn
      icon
      top
      left
      fixed
      @click.native.stop="drawer = !drawer">
      <v-icon>menu</v-icon>
    </v-btn>
    <page/>
  </v-app>
</template>

<script>
import { loadScript } from 'ajax'
import page from 'page.vue'
import navigator from 'components/navigator.vue'
import toolbar from 'components/toolbar.vue'

export default {
  components: { navigator, toolbar, page },
  data () {
    return {
      drawer: false
    }
  },
  created () {
    this.auth_init()
  },
  methods: {
    async auth_init () {
      await loadScript('https://apis.google.com/js/platform.js')
      this.$store.dispatch('authInit')
    }
  }
}
</script>
