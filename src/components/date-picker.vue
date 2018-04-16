<template>
  <v-menu :close-on-content-click="true"
          class="date-picker"
          offset-y
          max-width="290px">
    <v-text-field slot="activator"
                  :label="label"
                  :value="value | localeString('Date')"
                  :name="name"
                  prepend-icon="event"
                  readonly
                  :error="error"
                  :rules="rules"
                  @focus="$emit('focus')"
                  @blur="$emit('blur')"
                  :required="required !== undefined"></v-text-field>
    <v-date-picker :value="value ? new Date(value).toJSON() : null"
                   @input="e => $emit('input', e)"
                   no-title
                   dark
                   scrollable>
    </v-date-picker>
  </v-menu>
</template>

<script>

export default {
  name: 'date-picker',
  props: ['value', 'label', 'required', 'name', 'error', 'rules']
}
</script>
