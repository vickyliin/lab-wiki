<template>
  <v-select
    :label="label"
    :prepend-icon="icon"
    :items="people"
    :value="value"
    :required="required !== undefined"
    @input="e => $emit('input', e)"
    item-value="account"
    max-height="20rem"
    return-object
    :error="error"
    :rules="rules"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    autocomplete
    hide-details>
    <template slot="item" slot-scope="data">
      <v-list-tile-content>
        <v-list-tile-title v-html="data.item.name"/>
        <v-list-tile-sub-title v-html="data.item.account"/>
      </v-list-tile-content>
    </template>
  </v-select>
</template>
<script>
export default {
  name: 'member-selector',
  props: ['icon', 'label', 'value', 'required', 'error', 'rules'],
  data () {
    return {
      people: [],
      name2index: {}
    }
  },
  created () {
    this.crud()
  },
  methods: {
    setData (data) {
      this.people = data.map(d => ({
        name: d.name,
        account: d.account,
        text: `${d.name} /${d.account}`
      }))
      data.forEach((d, i) => {
        this.$set(this.name2index, d.name, i)
      })
      this.$watch('value', newVal => {
        if (newVal && newVal.constructor === String) {
          this.$emit('input', this.people[ this.name2index[newVal] ])
        }
      }, { immediate: true })
    }
  },
  computed: {
    model: () => '/contactList'
  }
}
</script>
