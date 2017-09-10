<template>
  <workstation-usage
    :headers="headers"
    :items-mapper="itemsMapper">
  </workstation-usage>
</template>

<script>
  import workstationUsage from 'components/workstation-usage.vue'

  export default {
    components: { workstationUsage },
    data() {
      return {
        headers: 'server cpu usage memory'.split(' '),
        itemsMapper(d){
          return {
            server: d.hostname.replace('nlg-wks-', ''),
            cpu: {
              display: d.cpuinfo.type
            },
            name: d.cpuinfo.type,
            usage: parseInt(d.cpu.cpu_usage/d.cpuinfo.threads),
            memory: this.setMemory({
              usage: parseInt(d.cpu.mem_usage),
              total: parseInt(d.cpu.mem_total),
            }),
            logtime: new Date(d.logtime),
          }
        }
      }
    },
  }
</script>
