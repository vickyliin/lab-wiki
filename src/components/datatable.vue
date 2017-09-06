<template>
  <v-data-table
    :hide-actions="!actions"
    :headers="vheaders"
    :items="items"
    :pagination.sync="pagination"
    :customSort="customSort"
    :search="search"
    :filter="filter">
    <template slot="headers" scope="props">
      <tr>
        <th v-for="header in props.headers" :key="header.text"
            :class="['column',
            header.disableSort? '':'sortable',
            pagination.descending? 'desc':'asc',
            header.value === pagination.sortBy ? 'active' : '',
            header.text]"
            @click="changeSort(header.value)">
          {{ header.text }}
          <v-icon v-if="!header.disableSort">arrow_upward</v-icon>
        </th>
      </tr>
    </template>
    <template slot="items" scope="props">
      <tr>
        <td class="text-xs" :class="header.value" v-for="header in vheaders">
          <template v-if="props.item[header.value] === undefined"></template>
          <span v-else-if="search"
                v-html="highlight(props.item[header.value], header.display)"></span>
          <span v-else-if="props.item[header.value].display"
                v-html="props.item[header.value].display"></span>
          <span v-else-if="header.display"
                v-html="header.display(props.item[header.value], props.item[header.value].text)"></span>
          <span v-else :class="header.value"
                v-html="$options.filters.localeString(props.item[header.value])"></span>
        </td>
        <td style="padding-right: 1.2rem" align=right>
          <v-btn icon small @click.stop="actionIcon.action(props.item)"
                 style="margin: 0" :key="i"
                 :class="actionIcon.color+'--text'"
                 v-for="(actionIcon,i) in actionIcons"
                 v-if="actionIcon.show(props.item)">
            <v-icon>{{actionIcon.icon}}</v-icon>
          </v-btn>
        </td>
      </tr>
    </template>
    <template slot="footer">
      <slot name="footer"></slot>
    </template>
  </v-data-table>
</template>

<script>
  import _ from 'lodash'
  export default{
    props: ['headers', 'items', 'initPagination', 'search', 'actions', 'actionIcons'],
    data(){
      let vheaders = this.headers.map(header => {
        if(header.constructor === String)
          return {text: header, value: header}
        else if(header.text === undefined)
          return Object.assign(header, {text: header.value})
        else
          return header
      })
      return {
        pagination: this.initPagination,
        vheaders,
      }
    },
    methods: {
      customSort(items, index, sortDesc){
        if(index === null) return items
        let sortedItems = items.sort((r, l) => {
          let data = {r, l}
          for(let pos in data){
            let cellData = data[pos][index]
            if(!cellData && cellData !== 0) data[pos] = -Infinity
            else if(!isNaN(cellData)) data[pos] = parseFloat(cellData)
            else if(cellData.constructor === String) data[pos] = cellData.replace(/^\s+|\s+$/g, '')
            else if(cellData.sort !== undefined) data[pos] = cellData.sort
            else if(cellData.text !== undefined) data[pos] = cellData.text
            if(data[pos].constructor !== String && isNaN(data[pos])){
              console.log('cellData', cellData)
              console.log('data[pos]', data[pos])
              console.log('!isNaN(cellData)', !isNaN(cellData))
              console.log('cellData.constructor === String', cellData.constructor === String)
              throw new TypeError('The cell data of datatable should be strings/numbers, or a sort/text property should be provided.')
            }
          }
          r = data.r; l = data.l
          if(r == l) return 0
          let isDesc
          if(r.constructor === l.constructor) isDesc = r < l
          else isDesc = r.constructor === Number // strings > numbers
          isDesc = isDesc? 1:-1
          return sortDesc? isDesc:-isDesc
        })
        this.$emit('sorted', sortedItems)
        return sortedItems
      },
      changeSort(column){
        if(this.pagination.sortBy === column)
          this.pagination.descending = !this.pagination.descending
        else{
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
      filter(value){
        if(value !== undefined
            && value !== null
            && value.constructor !== String){
          if(value.search !== undefined){
            value = value.search
          }
          else if(value.text !== undefined){
            value = value.text
          }
        }
        return this.searchRegex.test(value)
      },
      highlight(value, display){
        let highlightText = text => text.replace(this.searchRegex, '<mark>$1</mark>')
        if(display !== undefined){
          let text = highlightText(value.text)
          return display(value, text)
        }
        else{
          return highlightText(value)
        }
      }
    },
    computed: {
      searchRegex(){
        try{
          return new RegExp(`(${this.search})`, 'ig')
        }
        catch(e){
          return new RegExp(`(${_.escapeRegExp(this.search)})`, 'ig')
        }
      },
    },
  }
</script>