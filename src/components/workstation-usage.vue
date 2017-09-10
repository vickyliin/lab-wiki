<template>
  <v-container>
    <v-layout column>
      <v-container fluid>
        <v-layout row justify-center class="text-xs">
          <v-flex>
            Last Update: {{lastUpdate | localeString}}
            <v-icon class="ml-1 link"
                    :class="{ rotate: pulling }"
                    @click="refresh()">refresh</v-icon>
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
          <datatable v-bind="table"
                     @sorted="items => this.sortedItems = items"
                     @clickSort="sorting = true">
          </datatable>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { queryInterval } from 'config'
  import datatable from 'components/datatable.vue'
  import chart from 'components/chart.vue'

  export default {
    props: {
      headers: {
        type: Array,
        required: true,
      },
      itemsMapper: {
        type: Function,
        required: true,
      },
      itemsFilter: {
        type: Function,
        default(){
          return () => true
        }
      },
    },
    components: { datatable, chart },
    data(){
      return {
        sortedItems: null,
        lastUpdate: null,
        latestLogtime: null,
        interval: null,
        table: {
          headers: this.headers,
          items: [],
          initPagination: {
            sortBy: 'memory',
            rowsPerPage: -1,
            descending: true
          },
        },
        chart: {
          type: 'bar',
          data: {
            labels: null,
            datasets: [
              {
                label: 'Free Memory',
                data: null,
                yAxisID: 'MB',
                backgroundColor: "rgba(55, 160, 225, 0.5)",
              },
              {
                label: 'Used Memory',
                data: null,
                yAxisID: 'MB',
                backgroundColor: "rgba(225, 80, 75, 0.5)"
              },
              {
                label: 'Usage',
                data: null,
                yAxisID: '%',
                type: 'line',
                borderColor: "rgba(255,255,255,0.5)",
                backgroundColor: "rgba(0,0,0,0)"
              },
            ],
          },
          options: {
            scales: {
              xAxes: [{
                stacked: true,
                gridLines: { display: false }
              }],
              yAxes: [
                {
                  id: 'MB',
                  stacked: true,
                  position: 'left',
                  gridLines: { display: false },
                  ticks: { callback: val => val.toLocaleString() },
                  scaleLabel: {
                    display: true,
                    labelString: 'Memory (MB)'
                  }
                },
                {
                  id: '%',
                  position: 'right',
                  scaleLabel: {
                    display: true,
                    labelString: 'Usage %'
                  },
                  ticks: {
                    min: 0,
                    max: 100,
                  },
                },
              ],
            },
            tooltips: {
              mode: 'index',
              callbacks: {
                afterTitle: ([{ index: i }]) => this.sortedItems[i].name.display,
                afterBody: ([{ index: i }]) => `Total Memory: ${this.localeString(this.sortedItems[i].memory.total)} MB`,
                afterFooter: ([{ index: i }]) => this.localeString(this.sortedItems[i].logtime),
              },
              footerFontStyle: 'normal',
              footerFontSize: 11,
              bodySpacing: 3,
            },
          },
        },
      }
    },
    created(){
      this.crud()
      this.interval = setInterval(this.crud, queryInterval)
    },
    methods: {
      setMemory(mem) {
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
      setTableItems(data) {
        if (!data) return
        this.table.items = data
          .filter(this.itemsFilter.bind(this))
          .map(this.itemsMapper.bind(this))
      },
      setData(data) {
        if (!data) return
        this.setTableItems(data)
        this.lastUpdate = new Date()
        this.latestLogtime = new Date(
          Math.max.apply(null, this.table.items.map(d => d.logtime)))
      },
      refresh() {
        if (this.pulling) return
        this.crud()
      },
    },
    computed: {
      model(){
        return '/workstations'
      },
    },
    watch: {
      sortedItems(items) {
        let chartData = this.chart.data
        chartData.labels = []
        for (let dataset of chartData.datasets)
          dataset.data = []
        for (let item of items) {
          chartData.labels.push('wks-' + item.server)
          chartData.datasets[0].data.push(item.memory.free)
          chartData.datasets[1].data.push(item.memory.usage)
          chartData.datasets[2].data.push(item.usage)
        }
      }
    },
    destroyed() {
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
