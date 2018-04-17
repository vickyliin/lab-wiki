<template>
  <v-container pa-3>
    <p v-if="userName">
      Hi,
      <em>{{ userName }}</em>! <br> You have signed in to
      <em>{{ userEmail }}</em>.
    </p>
    <p v-if="!available">
      Please sign in to your
      <em>NLG account</em> to view this page.
    </p>
    <v-layout justify-end>
      <v-btn
        color="primary"
        round
        @click="signIn">
        <v-icon left>mdi-google</v-icon>
        Sign In
      </v-btn>
      <v-btn
        outline
        round
        @click="signOut">
        Sign Out
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { gSuiteDomain } from 'config'

export default {
  data () {
    return {
      auth2: null
    }
  },
  computed: {
    available () {
      return this.userDomain === gSuiteDomain
    },
    ...mapGetters(['userName', 'userDomain', 'userEmail'])
  },
  methods: {
    signIn () {
      this.$store.dispatch('signIn')
    },
    signOut () {
      this.$store.dispatch('signOut')
    }
  }
}
</script>

<style lang="stylus">
  em
    font-size: larger
    font-style: initial
    margin: .2rem
</style>
