<template>
  <v-container fluid>
    <canvas></canvas>
  </v-container>
</template>

<script>
import Chart from 'chart.js'
import 'chartjs-plugin-datalabels'
let glob = Chart.defaults.global
Chart.defaults.global = {
  ...glob,
  defaultFontColor: 'rgba(255,255,255,.8)',
  defaultFontSize: 14,
  defaultFontFamily: 'Roboto, Sans-serif'
}
glob.tooltips.callbacks.label = (
  {
    datasetIndex: i,
    yLabel
  },
  {
    datasets
  }
) => `${datasets[i].label}: ${yLabel.toLocaleString()} ${datasets[i].yAxisID}`
glob.plugins.datalabels = {
  display: false,
  font: {
    size: 9,
    family: 'Verdana, Sans-serif'
  }
}

export default {
  props: ['type', 'data', 'options'],
  data () {
    return {
      chart: null,
      initialize: {
        type: this.type,
        data: this.data,
        options: this.options
      }
    }
  },
  mounted () {
    this.chart = new Chart(this.$el.querySelector('canvas'), this.initialize)
    this.$emit('init', this.chart)
  },
  computed: {
    dataWatched () {
      return {
        datasets: this.data.datasets,
        label: this.data.labels
      }
    }
  },
  watch: {
    dataWatched () {
      this.chart.update()
    }
  }
}
</script>

<style scoped>
  .container {
    display: flex;
    justify-content: center;
  }
</style>
