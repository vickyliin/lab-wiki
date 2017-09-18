<template>
  <workstation-usage
    :headers="headers"
    :items-mapper="itemsMapper"
    :items-filter="itemsFilter"
    :items-reducer="itemsReducer">
  </workstation-usage>
</template>

<script>
import workstationUsage from 'components/workstation-usage.vue'

export default {
  components: { workstationUsage },
  data () {
    return {
      headers: 'server gpu usage fan memory temp'.split(' '),
      itemsFilter: d => Object.keys(d.gpu).length !== 0,
      itemsMapper (d) {
        return d.gpu.map(gpu => ({
          server: d.hostname.replace('nlg-wks-', ''),
          gpu: {
            display: gpu.type
          },
          name: gpu.type,
          usage: gpu.gpu_usage,
          fan: parseInt(gpu.fan),
          memory: this.setMemory({
            usage: gpu.mem_usage,
            total: gpu.mem_total
          }),
          temp: parseInt(gpu.temp),
          logtime: new Date(d.logtime)
        }))
      },
      itemsReducer: (arr, item) => [...arr, ...item]
    }
  }
}
</script>
