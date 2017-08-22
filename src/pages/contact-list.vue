<template>
  <v-container>
    <transition-group name="slide-y" tag="div" class="layout" id="contact-layout">
      <v-card v-for="person in contactData" :key="person.name" class="contact-card">
        <v-container>
          <h6>{{person.name}}</h6>
          <v-divider></v-divider>
          <v-list>
            <v-list-tile v-for="field in fields" :key="field.name">
              <v-list-tile-action>
                <v-icon>{{field.icon}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                {{person[field.name]}}
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-container>
      </v-card>
    </transition-group>
  </v-container>
</template>
<script>
  import VCardMedia from "vuetify/src/components/cards/VCardMedia"
  import $ from 'ajax'
  import {entry} from 'config'

  export default{
    components: {VCardMedia},
    data(){
      return {
        entry,
        contactData: [],
        fields: [
          {name: 'account', icon: 'account_circle'},
          {name: 'email', icon: 'email'},
          {name: 'phone', icon: 'phone'}
        ],
      }
    },
    created(){
      this.pullData()
    },
    computed: {
      url(){
        return this.entry + this.$route.fullPath
      }
    },
    methods: {
      pullData(){
        $.get({
          url: this.url,
          type: 'json',
          ready: (data, status) => {
            if(status == 200){
              let i = setInterval(() => {
                if(data.length){
                  this.contactData.push(data.pop())
                }
                else{
                  clearInterval(i)
                }
              }, 50)
            }
          },
        })
      }
    }
  }
</script>

<style lang="stylus">
  #contact-layout
    flex-wrap: wrap
    justify-content: space-around
  .contact-card
    flex-basis: 25rem
    margin: 2rem
    >.container>.layout
      align-items: center
    .list__tile
      height: 2.3rem
      font-size: inherit
    h6
      font-weight: normal
</style>