<template>
  <v-toolbar
    app
    clipped-left
    fixed
    :scroll-off-screen="$vuetify.breakpoint.xsOnly"
    :scroll-threshold="10">
    <v-btn icon @click.native.stop="$emit('input', !value)">
      <v-icon>menu</v-icon>
    </v-btn>
    <v-toolbar-title>
      Natural Language Processing Lab
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="toLogin">
      <v-avatar>
        <img v-if="userImg" :src="userImg" alt="avatar">
        <v-icon v-else>
          account_circle
        </v-icon>
      </v-avatar>
    </v-btn>
  </v-toolbar>
</template>

<script>
import {mapGetters} from 'vuex'
export default{
  props: ['value'],
  methods: {
    toLogin () {
      this.$store.commit('status', 401)
    }
  },
  computed: mapGetters([
    'userImg'
  ])
}
</script>
