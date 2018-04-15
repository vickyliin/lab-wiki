<template>
  <v-app dark>
    <navigator v-model="drawer"></navigator>
    <toolbar v-model="drawer"></toolbar>
    <page></page>
  </v-app>
</template>

<script>
import { load_script } from 'ajax'
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
    async auth_init() {
      await load_script('https://apis.google.com/js/platform.js')
      this.$store.dispatch('authInit')
    }
  },
  created () {
    this.auth_init()
  }
}
</script>

