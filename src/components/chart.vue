<template>
  <canvas></canvas>
</template>

<script>
  import Chart from 'chart'
  export default{
    props: ['type', 'data', 'options'],
    data(){return {
      chart: null
    }},
    mounted(){
      this.chart = new Chart(this.$el, this.$props)
    },
    watch: {
      data(){
        this.chart.update()
      }
    },
  }
</script>