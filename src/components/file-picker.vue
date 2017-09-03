<template>
  <v-text-field label="Slide"
                :value="filePath"
                readonly
                :single-line="singleLine"
                class="file-picker"
                @click.prevent="selectFile">
  </v-text-field>
</template>

<script>
  export default{
    props: ['value'],
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
    }
  }
</script>

<style lang="stylus">
  .file-picker input
    cursor: pointer
</style>