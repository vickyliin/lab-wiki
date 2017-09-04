<template>
  <v-select
      :label="label"
      :prepend-icon="icon"
      :items="people"
      :value="value"
      :required="required !== undefined"
      @input="e => $emit('input', e)"
      item-text="name"
      max-height="20rem"
      return-object
      :error="error"
      autocomplete>
    <template slot="item" scope="data">
      <v-list-tile-content>
        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
        <v-list-tile-sub-title v-html="data.item.account"></v-list-tile-sub-title>
      </v-list-tile-content>
    </template>
  </v-select>
</template>
<script>
  export default {
    props: ['icon', 'label', 'value', 'required', 'error'],
    data(){
      return {
        people: [],
      }
    },
    created(){
      this.pullData()
    },
    methods: {
      async pullData(){
        let data = await this.getData('/contactList')
        this.people = data
      },
    },
  }
</script>
