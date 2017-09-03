<template>
  <v-container>
    <v-layout column>
      <v-container fluid>
        <v-layout row justify-center class="text-xs">
          <v-flex>
            Last Update: {{lastUpdate | localeString}}
            <v-icon class="ml-1 link"
                    :class="{rotate: pulling}"
                    @click="onClickRefresh()">refresh</v-icon>
          </v-flex>
          <v-flex class="text-xs-right">
            Latest Logtime: {{latestLogtime | localeString}}
          </v-flex>
        </v-layout>
      </v-container>
      <v-flex>
        <v-container fluid>
          <chart v-bind="chart"></chart>
        </v-container>
      </v-flex>
      <v-flex>
        <v-container fluid>
          <datatable v-bind="table" @sorted="items => this.sortedItems = items" @clickSort="sorting=true">
          </datatable>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import $ from 'ajax'
  import {wsDataEntry, queryInterval} from 'config'

  import datatable from 'components/datatable.vue'
  import chart from 'components/chart.vue'

  export default {
    components: {datatable, chart},
    data(){return {
      table: {
        headers: 'server gpu fan memory temp'.split(' '), 
        items: [],
        initPagination: {
          sortBy: 'memory',
          rowsPerPage: -1,
          descending: true
        },
      },
      sortedItems: null,
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
          tooltips: {
            mode: 'index',
            callbacks: {
              afterTitle: (tt, ch) => //console.log(tt, ch)
                this.sortedItems[tt[0].index].gpu,
              afterBody: (tt, ch) =>
                `Total Memory: ${this.localeString(
                    this.sortedItems[tt[0].index].memory.total)} MB`,
              afterFooter: (tt, ch) =>
                this.localeString(this.sortedItems[tt[0].index].logtime),
            },
            footerFontStyle: 'normal',
            footerFontSize: 11,
            bodySpacing: 3,
          },
        },
      },
      lastUpdate: null,
      latestLogtime: null,
      status: 0,
      pulling: false,
      interval: null,
    }},
    created(){
      this.pullData()
      this.interval = setInterval(this.pullData, queryInterval)
    },
    methods: {
      localeString(time){
        return this.$options.filters.localeString(time)
      },
      setMemory(mem){
        let free = mem.total - mem.usage
        return {
          free, sort: free,
          usage: mem.usage,
          total: mem.total,
          display: `
            <span class="mem_usage">${this.localeString(mem.usage)}</span>
            <span class="mem_tot">${this.localeString(mem.total)}</span>
          `
        }
      },
      setTableItems(data){
        if(!data) return
        this.table.items = data
            .filter(d => Object.keys(d.gpu).length !== 0)
            .map(d => ({
              server: d.hostname.replace('nlg-wks-', ''),
              gpu: d.gpu.type,
              fan: parseInt(d.gpu.fan),
              memory: this.setMemory({
                usage: d.gpu.mem_usage,
                total: d.gpu.mem_total,
              }),
              temp: parseInt(d.gpu.temp),
              logtime: new Date(d.logtime),
            }))
      },
      async pullData(){
        this.pulling = true
        let {response, status} = await $.get({
          url: this.url,
          type: 'json',
          credential: false,
        })
        this.$store.commit('status', status)
        if(status !== 200) return
        this.pulling = false
        this.assignPulledData(response)
      },
      assignPulledData(data){
        if(!data) return
        this.setTableItems(data)
        this.lastUpdate = new Date()
        this.latestLogtime = new Date(
            Math.max.apply(null, this.table.items.map(d=>d.logtime)))
      },
      onClickRefresh(){
        if(this.pulling) return
        this.pullData()
      },
    },
    watch: {
      sortedItems(items){
        let chartData = this.chart.data
        chartData.labels = []
        for(let dataset of chartData.datasets)
          dataset.data = []
        for(let item of items){
          chartData.labels.push('wks-'+item.server)
          chartData.datasets[0].data.push(item.memory.free)
          chartData.datasets[1].data.push(item.memory.usage)
          chartData.datasets[2].data.push(item.temp)
        }
      }
    },
    computed: {
      url(){
        return wsDataEntry
      }
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