<template>
  <v-menu
    :close-on-content-click="true"
    class="date-picker"
    offset-y
    max-width="290px">
    <v-text-field
      slot="activator"
      :label="label"
      :value="dateObj | localeString('Date')"
      :name="name"
      :error="error"
      :required="required !== undefined"
      prepend-icon="event"
      readonly
      hide-details
      @focus="$emit('focus')"
      @blur="$emit('blur')"/>
    <v-date-picker
      :value="dateObj && dateObj.toJSON()"
      no-title
      dark
      scrollable
      @input="e => $emit('input', e)"/>
  </v-menu>
</template>

<script>

export default {
  name: 'DatePicker',
  props: {
    value: {
      type: [Date, Number, String],
      default: null
    },
    label: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    error: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dateObj () {
      return this.value && new Date(this.value)
    }
  }
}
</script>
