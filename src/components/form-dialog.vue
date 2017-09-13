<template>
  <v-dialog :width="width"
            :value="display"
            @input="e => $emit('update:display', e)">
    <v-card>
      <v-card-title>
        <v-container class="headline"
                     fluid>
          {{ title }}
        </v-container>
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-layout column>
            <component v-for="(field, i) in fields"
                       v-bind="field"
                       :key="i"
                       :is="field.component"
                       :prepend-icon="field.icon"
                       :error="error[i]"
                       :value="value? value[field.name]: null"
                       @input="data => onInput(field.name, data)">
            </component>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat
               @click="clear">Clear</v-btn>
        <v-btn flat
               primary
               @click="submit"
               :loading="loading">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import * as components from './*.vue'

export default {
  components,
  props: ['width', 'display', 'title', 'fields', 'value'],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    onInput (name, data) {
      this.$emit('input', { ...this.value, [name]: data })
    },
    clear () {
      this.$emit('input', null)
    },
    async submit () {
      if (!this.valid) return
      this.loading = true
      await new Promise(resolve => this.$emit('submit', resolve))
      this.$emit('update:display', false)
      this.clear()
      this.loading = false
    }
  },
  computed: {
    error () {
      return this.fields.map(
        ({ required, name }) => required &&
          (!this.value || !this.value[name]))
    },
    valid () {
      return this.error.every(e => !e)
    }
  }
}
</script>
