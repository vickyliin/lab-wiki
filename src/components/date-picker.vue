<template>
  <v-menu :close-on-content-click="true"
          class="date-picker"
          offset-y
          max-width="290px">
    <v-text-field slot="activator"
                  :label="label"
                  :value="dateObj | localeString('Date')"
                  :name="name"
                  prepend-icon="event"
                  readonly
                  hide-details
                  :error="error"
                  :rules="rules"
                  @focus="$emit('focus')"
                  @blur="$emit('blur')"
                  :required="required !== undefined"/>
    <v-date-picker :value="dateObj && dateObj.toJSON()"
                   @input="e => $emit('input', e)"
                   no-title
                   dark
                   scrollable/>
  </v-menu>
</template>

<script>

export default {
  name: 'date-picker',
  props: ['value', 'label', 'required', 'name', 'error', 'rules'],
  computed: {
    dateObj () {
      return this.value && new Date(this.value)
    }
  }
}
</script>
