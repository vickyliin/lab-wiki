<template>
  <v-app dark>
    <navigator v-model="drawer"></navigator>
    <toolbar v-model="drawer"></toolbar>
    <v-btn icon top left fixed @click.native.stop="drawer = !drawer">
      <v-icon>menu</v-icon>
    </v-btn>
    <page></page>
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
      drawer: true
    }
  },
  methods: {
    async auth_init () {
      await loadScript('https://apis.google.com/js/platform.js')
      this.$store.dispatch('authInit')
    }
  },
  created () {
    this.auth_init()
  }
}
</script>
