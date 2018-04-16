<template>
  <v-layout v-resize="e => resize()">
    <canvas></canvas>
  </v-layout>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
  props: ['type', 'data', 'options'],
  data () {
    return {
      chart: null,
      initialize: {
        type: this.type,
        data: this.data,
        options: this.options
      },
      size: {
        h: null,
        w: null,
        portrait: null
      }
    }
  },
  methods: {
    async drawChart (config) {
      let { h, w, portrait } = this.size
      if (portrait) {
        config.options.scales.yAxes.forEach(
          yAxes => { yAxes.display = false })
      }
      await this.chart
      if (this.chart && this.chart.destroy) { this.chart.destroy() }
      let canvas = this.setCanvas(h, w)
      this.chart = new Chart(canvas, config)
    },
    resize: debounce(function () {
      let { h, w, portrait } = this.size
      this.calcSize()
      if (h !== this.size.h ||
          w !== this.size.w ||
          portrait !== this.size.portrait) {
        if (this.chart.config) {
          this.drawChart({
            type: this.chart.config.type,
            data: this.chart.config.data,
            options: this.chart.config.options
          })
        }
      }
    }, 300),
    calcSize () {
      const ratio = 2
      let w = window.innerWidth
      let h = window.innerHeight
      let portrait = false

      if (!this.$vuetify.breakpoint.xsOnly) w *= 0.9
      if (w < h) {
        h = w
        w = parseInt(h * ratio, 10)
        portrait = true
      } else {
        h = parseInt(w / ratio, 10)
      }
      this.size = {h, w, portrait}
    },
    setCanvas (h, w) {
      let canvas = this.$el.querySelector('canvas')
      canvas.parentNode.style.height = h + 'px'
      canvas.parentNode.style.width = w + 'px'
      canvas.width = w
      canvas.height = h
      canvas.style.height = h + 'px'
      canvas.style.width = w + 'px'
      return canvas
    }
  },
  created () {
    this.chart = this.$store.dispatch('initChartjs')
  },
  mounted () {
    this.calcSize()
    this.drawChart(this.initialize)
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
