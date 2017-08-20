<template>
  <v-container v-if="status == 0" row class="text-xs-center">
    <v-progress-circular :indeterminate="true"></v-progress-circular>
  </v-container>
  <v-container v-else-if="status == 200">
    <v-layout column>
      <v-flex row class="mb-3 text-xs">
        Last Update: {{lastUpdate.toLocaleString('haw-us')}}
        <v-icon class="ml-1 link"
                :class="{rotate: pulling}"
                @click="if(pulling) return
                        pulling = true;
                        pullData(()=>pulling = false)">refresh</v-icon>
      </v-flex>
      <v-flex>
        <v-container fluid>
          <chart v-bind="chart" @init="e => chartjs=e"></chart>
        </v-container>
      </v-flex>
      <v-flex>
        <v-container fluid>
          <datatable v-bind="table" @sorted="e => onSorted(e)" @clickSort="sorting=true">
          </datatable>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
  <v-container v-else row class="v-center">
    <p>
      <v-icon class="mr-1">error</v-icon>
      The GPU usage data is unavailable now. Please
      <a :href="$route.fullPath">try again</a>
      later or contact our web administrator.
    </p>
  </v-container>
</template>

<script>
  import $ from 'ajax'
  import {entry} from 'config'

  import datatable from 'components/datatable.vue'
  import chart from 'components/chart.vue'

  export default {
    components: {datatable, chart},
    data(){return {
      entry,
      table: {
        headers: 'server gpu fan memory temp'.split(' '), 
        items: [],
        initSortBy: 'memory',
      },
      chart: {
        type: 'bar',
        data: {
          labels: null,
          datasets: [
            {label: 'Free Memory', data: null, yAxisID: 'MB', 
                backgroundColor: "rgba(55, 160, 225, 0.5)",},
            {label: 'Used Memory', data: null, yAxisID: 'MB', 
                backgroundColor: "rgba(225, 80, 75, 0.5)"},
            {label: 'Temperature', data: null, yAxisID: '°C', type: 'line',
                borderColor: "rgba(255,255,255,0.5)",
                backgroundColor: "rgba(0,0,0,0)"},
          ],
        },
        options: {
          scales: {
            xAxes: [{stacked: true, gridLines: {display: false}}],
            yAxes: [
              {id: 'MB', stacked: true, position: 'left', gridLines: {display: false},
                  ticks: {callback: val => val.toLocaleString()},
                  scaleLabel: {
                    display: true,
                    labelString: 'Memory of GPU (MB)'
                  }},
              {id: '°C', position: 'right', scaleLabel: {
                display: true,
                labelString: 'Temperature (°C)'
              }}
            ],
          },
          tooltips: {mode: 'index'}
        },
      },
      chartjs: null,
      lastUpdate: null,
      status: 0,
      pulling: false,
      interval: null,
      queryInterval: 600000,
      sorting: true,
    }},
    created(){
      this.pullData((data, status) => this.status = status)
      this.interval = setInterval(this.pullData, this.queryInterval)
    },
    methods: {
      pullData(onready){
        $.get({
          url: this.entry,
          type: 'json',
          ready: (data, status) => {
            if(onready) onready(data, status)
            if(status == 200){
              this.table.items = data.filter(d => Object.keys(d.gpu).length !== 0).map(d => ({
                server: d.hostname.replace('nlg-wks-', ''),
                gpu: d.gpu.type,
                fan: parseInt(d.gpu.fan),
                memory: Object.assign(d.gpu.mem_total-d.gpu.mem_usage, {
                  display: [
                    {name: 'mem_usage', value: d.gpu.mem_usage},
                    {name: 'mem_tot', value: d.gpu.mem_total},
                  ],
                }),
                temp: parseInt(d.gpu.temp),
              }))
              this.lastUpdate = new Date()
            }
          }
        })
      },
      onSorted(items){
        if(!this.sorting) return
        var chartData = this.chart.data
        chartData.labels = []
        for(let dataset of chartData.datasets)
          dataset.data = []
        for(let item of items){
          chartData.labels.push('wks-'+item.server)

          let free = item.memory.valueOf()
          chartData.datasets[0].data.push(free)
          let used = item.memory.display[0].value
          chartData.datasets[1].data.push(used)
          let temp = item.temp
          chartData.datasets[2].data.push(temp)
        }
        if(this.chartjs){
          this.sorting = false
          this.chartjs.update()
        }
      },
    },
    destroyed(){
      clearInterval(this.interval)
    },
  }
</script>

<style lang="stylus" scoped>
  animation()
    -webkit-animation arguments
    -moz-animation arguments
    animation arguments
  .rotate
    animation rotate .5s linear infinite
    cursor: default
  @keyframes rotate{
      100% {
        -webkit-transform: rotate(360deg)
        transform: rotate(360deg)
      }
  }
</style>