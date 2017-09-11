<template>
  <v-data-table
    :hide-actions="!actions"
    :headers="vheaders"
    :items="items"
    :customSort="customSort"
    :search="search"
    :filter="filter"
    :loading="loading"
    :select-all="selectAll"
    :selected-key="selectedKey"
    :value="value"
    :pagination="pagination"
    @update:pagination="e => $emit('update:pagination', e)"
    @input="e => $emit('input', e)">
    <template slot="headers" scope="props">
      <tr>
        <th v-if="enableSelect">
          <v-checkbox
              v-if="selectAll"
              primary
              hide-details
              @click.native="toggleAll"
              :input-value="props.all"
              :indeterminate="props.indeterminate"
          ></v-checkbox>
        </th>
        <th v-for="(header,i) in props.headers" :key="header.text"
            :colspan="i === props.headers.length-1? 2:1"
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
      <tr :active="props.selected" @click="props.selected = !props.selected">
        <td v-if="enableSelect">
          <v-checkbox primary
                      hide-details
                      :input-value="props.selected"
          ></v-checkbox>
        </td>
        <td class="text-xs"
            v-for="({value: header, display},i) in vheaders"
            :class="header"
            :colspan="i === vheaders.length-1 && !hasIcon(props.item)? 2:1">
          <template v-if="props.item[header] == null"></template>
          <span v-else-if="search || highlightText"
                v-html="highlight(props.item[header], display)"></span>
          <span v-else-if="props.item[header].display !== undefined"
                v-html="props.item[header].display"></span>
          <span v-else-if="display"
                v-html="display(props.item[header], props.item[header].text)"></span>
          <span v-else :class="header"
                v-html="localeString(props.item[header], 'Date')"></span>
        </td>
        <td style="padding-right: 1.2rem" align="right" v-if="hasIcon(props.item)">
          <v-btn icon small
                 v-for="({show, href, action, color, icon},i) in actionIcons"
                 v-if="show(props.item)"
                 :href="href? href(props.item): ''"
                 @click.stop="action(props.item)"
                 style="margin: 0" :key="i"
                 :class="color+'--text'">
            <v-icon>{{icon}}</v-icon>
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

  const sortOrder = {
    [Number]: 0,
    [Date]: 1,
    [String]: 2,
  }

  export default {
    props: [
      'headers',
      'items',
      'pagination',
      'search',
      'actions',
      'actionIcons',
      'loading',
      'selectAll',
      'selectedKey',
      'enableSelect',
      'value',
      'highlightText'
    ],
    data() {
      let vheaders = this.headers.map(header => {
        if (typeof header === 'string')
          return { text: header, value: header }
        else if (header.text === undefined)
          return { text: header.value, ...header }
        else
          return header
      })
      return {
        vheaders,
        selected: [],
      }
    },
    methods: {
      customSort(items, index, sortDesc) {
        if (index === null) return items
        let sortedItems = items.sort((r, l) => {
          let data = { r, l }
          for (let pos in data) {
            let cellData = data[pos][index]
            let dataForSort

            if (cellData == null) dataForSort = cellData
            else if (cellData.sort !== undefined) dataForSort = cellData.sort
            else if (cellData.text !== undefined) dataForSort = cellData.text
            else if (cellData.display !== undefined) dataForSort = cellData.display
            else dataForSort = cellData

            if (!dataForSort && dataForSort !== 0) data[pos] = -Infinity
            else if (!isNaN(Number(dataForSort))) data[pos] = parseFloat(dataForSort)
            else if (!isNaN(Date.parse(dataForSort))) data[pos] = new Date(dataForSort)
            else if (typeof dataForSort === 'string') data[pos] = dataForSort.trim()

            if (typeof data[pos] !== 'string' && isNaN(data[pos])) {
              console.log('cellData', typeof cellData, cellData)
              console.log('dataForSort', typeof dataForSort, dataForSort)
              console.log('data[pos]', data[pos])
              console.log('isNaN(data[pos])', isNaN(data[pos]))
              throw new TypeError('The cell data of datatable should be strings/numbers/dates, or a sort/text/display property should be provided.')
            }
          }
          r = data.r; l = data.l
          if (r === l) return 0
          let isDesc
          if (r.constructor === l.constructor) isDesc = r < l
          else {
            isDesc = sortOrder[r.constructor] < sortOrder[l.constructor]
          }
          isDesc = isDesc ? 1 : -1
          return sortDesc ? isDesc : -isDesc
        })
        this.$emit('sorted', sortedItems)
        return sortedItems
      },
      changeSort(column) {
        let { descending, sortBy } = this.pagination
        if (sortBy === column)
          descending = !descending
        else {
          sortBy = column
          descending = false
        }
        this.$emit('update:pagination', { ...this.pagination, descending, sortBy })
      },
      toggleAll() {
        if (this.value.length) this.$emit('input', [])
        else this.$emit('input', this.items.slice())
      },
      filter(value) {
        if (value != null && typeof value !== 'string') {
          if (value.search !== undefined) {
            value = value.search
          }
          else if (value.text !== undefined) {
            value = value.text
          }
        }
        return this.searchRegex.test(this.localeString(value, 'Date'))
      },
      highlight(value, display) {
        let highlightText = text => text.replace(this.searchRegex, '<mark>$1</mark>')
        if (display !== undefined) {
          let text = highlightText(value.text)
          return display(value, text)
        }
        else if (value.display){
          return highlightText(value.display)
        }
        else {
          return highlightText(this.localeString(value, 'Date'))
        }
      },
      hasIcon(item) {
        return this.actionIcons
          && !this.actionIcons
            .map(icon => icon.show(item))
            .every(show => !show)
      }
    },
    computed: {
      searchRegex() {
        let text = this.highlightText || this.search
        try {
          return new RegExp(`(${text})`, 'ig')
        }
        catch (e) {
          return new RegExp(`(${_.escapeRegExp(text)})`, 'ig')
        }
      },
    },
  }
</script>
