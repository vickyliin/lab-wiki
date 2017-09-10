<template>
  <workstation-usage
    :headers="headers"
    :items-mapper="itemsMapper"
    :items-filter="itemsFilter">
  </workstation-usage>
</template>

<script>
  import workstationUsage from 'components/workstation-usage.vue'

  export default {
    components: { workstationUsage },
    data() {
      return {
        headers: 'server gpu usage fan memory temp'.split(' '),
        itemsMapper(d){
          return {
            server: d.hostname.replace('nlg-wks-', ''),
            gpu: {
              display: d.gpu.type
            },
            name: d.gpu.type,
            usage: d.gpu.gpu_usage,
            fan: parseInt(d.gpu.fan),
            memory: this.setMemory({
              usage: d.gpu.mem_usage,
              total: d.gpu.mem_total,
            }),
            temp: parseInt(d.gpu.temp),
            logtime: new Date(d.logtime),
          }
        },
        itemsFilter: d => Object.keys(d.gpu).length !== 0
      }
    },
  }
</script>
