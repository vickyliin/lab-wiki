<template>
  <v-text-field :value="filePath"
                readonly
                :label="label"
                :single-line="singleLine"
                class="file-picker"
                :prepend-icon="icon"
                :error="error"
                :rules="rules"
                @focus="$emit('focus')"
                @blur="$emit('blur')"
                @click.prevent="selectFile">
  </v-text-field>
</template>

<script>
  export default{
    name: 'file-picker',
    props: ['value', 'label', 'icon', 'error', 'rules'],
    data(){
      return {
        input: null,
        filePath: '',
      }
    },
    created(){
      let input = document.createElement('input')
      input.type = 'file'
      input.onchange = () => {
        this.filePath = this.input.value
        this.$emit('input', this.input.files[0])
      }
      this.input = input
    },
    methods: {
      selectFile(){
        this.input.click()
      }
    },
    computed: {
      singleLine(){
        return !this.filePath
      }
    },
    watch: {
      value(newVal){
        if(!newVal){
          this.input.value = ''
          this.filePath = ''
        }
      },
    },
  }
</script>

<style lang="stylus">
  .file-picker input
    cursor: pointer
</style>