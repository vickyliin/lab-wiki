<template>
  <v-select
    :label="label"
    :items="people"
    :value="value"
    :required="required !== undefined"
    prepend-icon="account_circle"
    item-value="account"
    max-height="20rem"
    return-object
    autocomplete
    hide-details
    @input="e => $emit('input', e)"
    @focus="$emit('focus')"
    @blur="$emit('blur')">
    <template
      slot="item"
      slot-scope="data">
      <v-list-tile-content>
        <v-list-tile-title v-html="data.item.name"/>
        <v-list-tile-sub-title v-html="data.item.account"/>
      </v-list-tile-content>
    </template>
  </v-select>
</template>
<script>
export default {
  name: 'MemberSelector',
  props: {
    label: {
      type: String,
      default: 'Member'
    },
    value: {
      type: [Object, String],
      default: null
    },
    required: {
      type: Boolean,
      default: null
    }
  },
  data () {
    return {
      people: [],
      name2index: {}
    }
  },
  computed: {
    model: () => '/contactList'
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
  }
}
</script>
