<template>
  <v-toolbar
    :scroll-off-screen="$vuetify.breakpoint.xsOnly"
    :scroll-threshold="10"
    app
    clipped-left
    fixed>
    <v-btn
      icon
      @click.native.stop="$emit('input', !value)">
      <v-icon>menu</v-icon>
    </v-btn>
    <v-toolbar-title>
      Natural Language Processing Lab
    </v-toolbar-title>
    <v-spacer/>
    <v-btn
      icon
      @click="toLogin">
      <v-avatar>
        <img
          v-if="userImg"
          :src="userImg"
          alt="avatar">
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
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  computed: mapGetters([
    'userImg'
  ]),
  methods: {
    toLogin () {
      this.$store.commit('status', 401)
    }
  }
}
</script>
