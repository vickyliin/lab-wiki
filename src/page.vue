<template>
  <v-content>
    <transition
      name="slide-y"
      mode="out-in"
      appear>
      <v-container
        :key="title"
        fluid>
        <h2 class="my-4 mx-2">{{ title | spaceSeparated }}</h2>

        <v-container
          v-if="status === 0"
          row
          class="text-xs-center">
          <v-progress-circular :indeterminate="true"/>
        </v-container>

        <login v-else-if="status === 401 || status === 403"/>

        <router-view v-else-if="status === 200"/>

        <v-container
          v-else
          row
          class="v-center">
          <p>
            <v-icon class="mr-1">error</v-icon>
            The page data is unavailable now. Please
            <a :href="url">try again</a>
            later or contact our web administrator.
          </p>
        </v-container>

      </v-container>
    </transition>
  </v-content>
</template>
<script>

import * as Pages from './pages/*.vue'
import Login from 'components/login.vue'

export default {
  components: { Login, ...Pages },
  computed: {
    title () {
      return this.$route.fullPath.slice(1)
    },
    status () {
      return this.$store.state.status
    },
    url () {
      return this.$route.fullPath
    }
  },
  watch: {
    url (url) {
      document.title = this.spaceSeparated(this.title) + ' - Natural Language Processing Lab'
      this.$store.commit('status', 200)
    }
  }
}

</script>

<style lang="stylus">
  main .container
    padding: 2.5rem 2rem
    @media screen and (max-width: 600px)
      padding: 0
</style>
