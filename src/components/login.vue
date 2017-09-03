<template>
  <v-container fluid>
    <p v-if="userName">
      Hi, <em>{{userName}}</em>! <br>
      You have signed in to <em>{{userEmail}}</em>.
    </p>
    <p  v-if="!available">
      Please sign in to your <em>NLG account</em> to view this page.
    </p>
    <v-layout justify-end>
      <v-btn @click="signIn" primary round>
        <v-icon left>mdi-google</v-icon>
        Sign In
      </v-btn>
      <v-btn @click="signOut" outline round>
        Sign Out
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
  import $ from 'ajax'
  import {mapGetters} from 'vuex'
  import {gSuiteDomain} from 'config'

  export default{
    data(){return{
      auth2: null,
    }},
    methods: {
      signIn(){
        this.$store.dispatch('signIn')
      },
      signOut(){
        this.$store.dispatch('signOut')
      }
    },
    computed: {
      available(){
        return this.userDomain === gSuiteDomain
      },
      ...mapGetters(['userName', 'userDomain', 'userEmail'])
    }
  }
</script>

<style lang="stylus">
  em
    font-size: larger
    font-style: initial
    margin: .2rem
</style>
