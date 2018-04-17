<template>
  <v-layout column>
    <v-layout
      row
      justify-center
      mx-2>
      <v-flex>
        <v-layout
          row
          d-inline-flex
          wrap>
          <v-flex
            mr-1
            xs12> Last Update: </v-flex>
          <v-flex>
            {{ lastUpdate | localeString }}
            <v-icon
              :class="{ rotate: pulling }"
              class="ml-1 link"
              @click="refresh()">refresh</v-icon>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex
        text-xs-right
        hidden-sm-and-down>
        Latest Logtime: {{ latestLogtime | localeString }}
      </v-flex>
    </v-layout>
    <v-container :style="{'overflow-x': 'auto'}">
      <chart v-bind="chart"/>
    </v-container>
    <v-layout>
      <v-container class="workstation">
        <datatable
          v-bind="table"
          :pagination.sync="table.pagination"
          @sorted="items => sortedItems = items"
          @clickSort="sorting = true"/>
      </v-container>
    </v-layout>
  </v-layout>
</template>

<script>
import { queryInterval } from 'config'
import datatable from 'components/datatable.vue'
import chart from 'components/chart.vue'

export default {
  components: { datatable, chart },
  props: {
    headers: {
      type: Array,
      required: true
    },
    itemsMapper: {
      type: Function,
      required: true
    },
    itemsFilter: {
      type: Function,
      default: () => true
    },
    itemsReducer: {
      type: Function,
      default: (arr, item) => [...arr, item]
    }
  },
  data () {
    return {
      sortedItems: null,
      lastUpdate: null,
      latestLogtime: null,
      interval: null,
      table: {
        headers: this.headers,
        items: [],
        pagination: {
          sortBy: 'memory',
          rowsPerPage: -1,
          descending: true
        },
        value: []
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
              backgroundColor: 'rgba(55, 160, 225, 0.5)'
            },
            {
              label: 'Used Memory',
              data: null,
              yAxisID: 'MB',
              backgroundColor: 'rgba(225, 80, 75, 0.5)',
              datalabels: {
                display: ({ dataIndex: i }) => this.sortedItems[i].blame != null,
                formatter: (val, { dataIndex: i }) => this.sortedItems[i].blame,
                anchor: 'end',
                rotation: -10
              }
            },
            {
              label: 'Usage',
              data: null,
              yAxisID: '%',
              type: 'line',
              borderColor: 'rgba(255,255,255,0.5)',
              backgroundColor: 'rgba(0,0,0,0)'
            }
          ]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
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
                  max: 100
                }
              }
            ]
          },
          tooltips: {
            mode: 'index',
            callbacks: {
              afterTitle: ([{ index: i }]) => this.sortedItems[i].name,
              afterBody: ([{ index: i }]) => `Total Memory: ${this.localeString(this.sortedItems[i].memory.total)} MB`,
              afterFooter: ([{ index: i }]) => this.localeString(this.sortedItems[i].logtime)
            },
            footerFontStyle: 'normal',
            footerFontSize: 11,
            bodySpacing: 3
          }
        }
      }
    }
  },
  computed: {
    model () {
      return '/workstations'
    }
  },
  watch: {
    sortedItems (items) {
      let chartData = this.chart.data
      chartData.labels = []
      for (let dataset of chartData.datasets) { dataset.data = [] }
      for (let item of items) {
        chartData.labels.push(item.label || 'wks-' + item.server)
        chartData.datasets[0].data.push(item.memory.free)
        chartData.datasets[1].data.push(item.memory.usage)
        chartData.datasets[2].data.push(item.usage)
      }
    }
  },
  created () {
    this.crud()
    this.interval = setInterval(this.crud, queryInterval)
  },
  destroyed () {
    clearInterval(this.interval)
  },
  methods: {
    setMemory (mem) {
      let free = mem.total - mem.usage
      return {
        free,
        sort: free,
        usage: mem.usage,
        total: mem.total,
        display: `
            <span class="mem_usage">${this.localeString(mem.usage)}</span>
            <span class="mem_tot">${this.localeString(mem.total)}</span>
          `
      }
    },
    setTableItems (data) {
      if (!data) return
      this.table.items = data
        .filter(this.itemsFilter.bind(this))
        .map(this.itemsMapper.bind(this))
        .reduce(this.itemsReducer.bind(this), [])
    },
    setData (data) {
      if (!data) return
      this.setTableItems(data)
      this.lastUpdate = new Date()
      this.latestLogtime = new Date(
        Math.max.apply(null, this.table.items.map(d => d.logtime)))
      this.selectDead()
    },
    selectDead () {
      this.table.value = []
      this.table.items.forEach(d => {
        if (d.logtime < Date.now() - 300000) {
          this.table.value.push(d)
        }
      })
    },
    refresh () {
      if (this.pulling) return
      this.crud()
    }
  }
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

<style>
.workstation .table tbody tr[active] {
  color: #f55;
  background: inherit
}
</style>
