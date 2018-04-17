<template>
  <v-dialog
    :width="width"
    :value="display"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    @input="e => $emit('update:display', e)">
    <v-card>
      <v-subheader>
        {{ title }}
      </v-subheader>
      <v-divider/>
      <v-container pb-0>
        <v-layout
          v-for="(field, i) in fields"
          :key="i"
          column
          pb-2>
          <component
            v-bind="field"
            :is="field.component"
            :prepend-icon="field.icon"
            :error="error[i]"
            :value="value? value[field.name]: null"
            @input="data => onInput(field.name, data)"/>
        </v-layout>
      </v-container>
      <v-container
        fill-height
        pt-0>
        <v-spacer/>
        <v-btn
          flat
          small
          @click="$emit('update:display', false)">Close</v-btn>
        <v-btn
          :loading="loading"
          flat
          small
          color="primary"
          @click="submit">Submit</v-btn>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import * as components from './*.vue'

export default {
  components,
  props: {
    width: {
      type: [String, Number],
      default: null
    },
    display: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    fields: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => {}
    },
    reset: {
      type: [Function, Object],
      default: null
    }
  },
  data () {
    return {
      loading: false
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
  }
}
</script>
