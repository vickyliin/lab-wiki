<template>
  <v-menu :close-on-content-click="true"
          max-width="290px"
          offset-y>
    <v-text-field
        slot="activator"
        :label="label"
        :value="value"
        prepend-icon="event"
        readonly
    ></v-text-field>
    <v-date-picker :value="value"
                   @input="e => $emit('input', e)"
                   no-title
                   scrollable>
    </v-date-picker>
  </v-menu>
</template>

<script>
  export default {
    props: ['value', 'label'],
  }
</script>

<style lang="stylus">
  .application--dark
  .picker--date__header
  .picker--date table th
    color: white
</style>