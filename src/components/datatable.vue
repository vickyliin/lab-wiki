<template>
  <v-data-table
    hide-actions
    :headers="vheaders"
    :items="items"
    :pagination.sync="pagination"
    :customSort="customSort"
    @sorted="e => $emit('sorted', e)">
    <template slot="headers" scope="props">
      <tr>
        <th v-for="header in props.headers" :key="header.text"
            :class="['column sortable',
            pagination.descending? 'desc':'asc',
            header.value === pagination.sortBy ? 'active' : '',
            header.text]"
            @click="changeSort(header.value)">
          {{ header.text }}
          <v-icon>arrow_upward</v-icon>
        </th>
      </tr>
    </template>
    <template slot="items" scope="props">
      <tr>
        <td class="text-xs" :class="header.value" v-for="header in vheaders">
          <template v-if="props.item[header.value] === undefined"></template>
          <template v-else-if="props.item[header.value].display">
            <span v-for="d in props.item[header.value].display"
                :class="d.name">{{d.value | localeString}}</span>
          </template>
          <span v-else :class="header.value">{{
            props.item[header.value] | localeString
          }}</span>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
  export default{
    props: ['headers', 'items', 'initSortBy'],
    data(){
      let vheaders = this.headers.map(header => {
        if(header.constructor == String)
          return {text: header, value: header}
        else if(!header.text)
          return Object.assign(header, {text: header.value})
        else
          return header
      })
      var vm = this
      return {
        pagination: {
          sortBy: this.initSortBy,
          rowsPerPage: -1,
        },
        vheaders,
        customSort(items, index, desc){
          let out = items.sort((r, l) => {
            if(index === null) return 0
            r = r[index]
            l = l[index]
            if(r == l) return 0
            var out = null
            if(isNaN(l) && isNaN(r)){
              if(r == undefined)
                out = false
              else if(l == undefined)
                out = true
              else
                out = r.replace(/^\s+|\s+$/g, '') > l.replace(/^\s+|\s+$/g, '')
            }
            else if(!isNaN(l) && !isNaN(r))
              out = parseFloat(r) > parseFloat(l)
            else
              out = isNaN(r)
            out = out || -1
            return desc? -out:out
          })
          vm.$emit('sorted', out)
          return out
        },
      }
    },
    methods: {
      changeSort(column){
        this.$emit('clickSort')
        if(this.pagination.sortBy === column)
          this.pagination.descending = !this.pagination.descending
        else{
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
    },
    // computed: {
    //   filteredItems(){
    //     this.$emit('sorted', this.$children[0].filteredItems)
    //     return this.$children[0].filteredItems
    //   },
    // },
  }
</script>