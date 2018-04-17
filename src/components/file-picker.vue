<template>
  <v-text-field
    :value="display(filePath)"
    :label="label"
    :single-line="singleLine"
    :prepend-icon="icon"
    class="file-picker"
    readonly
    hide-details
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @click.prevent="selectFile"/>
</template>

<script>
export default{
  name: 'FilePicker',
  props: {
    value: {
      type: [File, String],
      default: ''
    },
    label: {
      type: String,
      default: 'File'
    },
    icon: {
      type: String,
      default: 'slideshow'
    },
    display: {
      type: Function,
      default: filePath => filePath
    }
  },
  data () {
    return {
      input: null,
      filePath: ''
    }
  },
  computed: {
    singleLine () {
      return !this.display(this.filePath)
    }
  },
  watch: {
    value (newVal) {
      if (!newVal) {
        this.input.value = ''
        this.filePath = ''
      }
    }
  },
  created () {
    let input = document.createElement('input')
    input.type = 'file'
    input.onchange = () => {
      this.filePath = this.input.files[0].name
      this.$emit('input', this.input.files[0])
    }
    this.input = input
  },
  methods: {
    selectFile () {
      this.input.click()
    }
  }
}
</script>

<style lang="stylus">
  .file-picker input
    cursor pointer
</style>
