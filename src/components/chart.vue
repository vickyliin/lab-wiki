<template>
  <v-container fluid>
    <canvas></canvas>
  </v-container>
</template>

<script>
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
  methods: {
    async drawChart () {
      await this.chart
      this.chart = new Chart(this.$el.querySelector('canvas'), this.initialize)
    }
  },
  created () {
    this.chart = this.$store.dispatch('initChartjs')
  },
  mounted () {
    this.drawChart()
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
    async dataWatched () {
      await this.chart
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
