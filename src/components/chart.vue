<template>
  <v-layout
    v-resize="e => resize()"
    :justify-center="justifyCenter">
    <canvas/>
  </v-layout>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
  props: {
    type: {
      type: String,
      default: 'bar'
    },
    data: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
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
      },
      justifyCenter: null
    }
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
  },
  created () {
    this.chart = this.$store.dispatch('initChartjs')
  },
  mounted () {
    this.calcSize()
    this.drawChart(this.initialize)
    this.$emit('init', this.chart)
  },
  methods: {
    async drawChart (config) {
      let { h, w } = this.size
      if (window.innerWidth < 600) {
        config.options.scales.yAxes.forEach(
          yAxes => { yAxes.display = false })
      } else {
        config.options.scales.yAxes.forEach(
          yAxes => { yAxes.display = true })
      }
      await this.chart
      if (this.chart && this.chart.destroy) { this.chart.destroy() }
      let canvas = this.setCanvas(h, w)
      this.chart = new Chart(canvas, config)
    },
    resize: debounce(function () {
      let { h, w } = this.size
      this.calcSize()
      if (h !== this.size.h || w !== this.size.w) {
        if (this.chart.config) {
          this.drawChart({
            type: this.chart.config.type,
            data: this.chart.config.data,
            options: this.chart.config.options
          })
        }
      }
      this.setLayout(h, w)
    }, 300),
    calcSize () {
      const ratio = 1.8
      let w = window.innerWidth * 0.9
      let h = window.innerHeight

      w = w < 568 ? 560 : w
      h = w / ratio
      this.size = {h, w}
    },
    setCanvas (h, w) {
      let canvas = this.$el.querySelector('canvas')
      this.justifyCenter = window.innerWidth > w
      canvas.parentNode.style.height = h + 'px'
      canvas.parentNode.style.width = window.innerWidth < w ? w + 'px' : null
      canvas.width = w
      canvas.height = h
      canvas.style.height = h + 'px'
      canvas.style.width = w + 'px'
      return canvas
    },
    setLayout (h, w) {
      let canvas = this.$el.querySelector('canvas')
      // don't set width for large enough width to center the chart
      canvas.parentNode.style.width = window.innerWidth < w ? w + 'px' : null
      canvas.parentNode.style.height = h + 'px'
    }
  }
}
</script>
