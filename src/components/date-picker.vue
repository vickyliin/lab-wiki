<template>
  <v-menu :close-on-content-click="true"
          class="date-picker"
          offset-y fullWidth>
    <v-text-field
        slot="activator"
        :label="label"
        :value="value"
        :name="name"
        prepend-icon="event"
        readonly
        :error="error"
        :required="required !== undefined"
    ></v-text-field>
    <v-date-picker :value="value"
                   @input="e => $emit('input', e)"
                   no-title dark
                   scrollable>
    </v-date-picker>
  </v-menu>
</template>

<script>
  export default {
    props: ['value', 'label', 'required', 'name', 'error'],
  }
</script>