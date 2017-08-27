<template>
  <v-container fluid>
    <canvas></canvas>
  </v-container>
</template>

<script>
  import Chart from 'chart.js'
  let glob = Chart.defaults.global
  glob.defaultFontColor = 'rgba(255,255,255,.8)'
  glob.defaultFontSize = 14
  glob.defaultFontFamily = 'Roboto'
  glob.tooltips.callbacks.label = (tt, ch) => //console.log(ch)
      `${ch.datasets[tt.datasetIndex].label}: ${tt.yLabel.toLocaleString()} ${
          ch.datasets[tt.datasetIndex].yAxisID}`

  export default{
    props: ['type', 'data', 'options'],
    data(){return {
      chart: null,
      initialize: {
        type: this.type,
        data: this.data,
        options: this.options,
      },
    }},
    mounted(){
      this.chart = new Chart(this.$el.querySelector('canvas'), this.initialize)
      this.$emit('init', this.chart)
    },
    computed: {
      dataWatched(){
        return {
          datasets: this.data.datasets,
          label: this.data.labels,
        }
      }
    },
    watch: {
      dataWatched(){
        this.chart.update()
      }
    }
  }
</script>

<style scoped>
  .container{
    display: flex;
    justify-content: center;
  }
</style>