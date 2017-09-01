<template>
  <v-container>
    <v-btn @click="login">
      Login
      <v-icon right>fa-google</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
  import $ from 'ajax'
  export default{
    data(){return{
      auth2: null,
    }},
    methods: {
      login(){
        let user = this.$store.dispatch('gSignIn')
//        console.log(user)
      }
    },
    created(){
//      this.$store.dispatch('gAuthInit')
    },
  }
</script>