<template>
  <v-container>

  </v-container>
</template>

<script>
  import {googleAuthClientID, entry} from 'config'
  import 'assets/js/google.api-client'
  import $ from 'ajax'
  export default{
    methods: {
      loginSucceed(){
        this.$store.commit('status', 200)
      }
    },
    created(){
      gapi.load('auth2', () => {
        let auth2 = gapi.auth2.init({
          client_id: googleAuthClientID,
          cookiepolicy: 'single_host_origin',
        })
        auth2.signIn().then(user => {
          console.log(user)
          $.post({
            url: entry + '/login',
            data: {
              id_token: user.getAuthResponse().id_token
            },
            ready: (data, status) => {
              if(status === 403 || status === 401){
                auth2.signOut()
              }
              else{
                this.loginSucceed()
              }
            }
          })
        })
      })
    }
  }
</script>