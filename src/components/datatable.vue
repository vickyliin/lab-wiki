<template>
  <v-data-table
    :hide-actions="!actions"
    :headers="vheaders"
    :items="items"
    :custom-sort="customSort"
    :search="search"
    :filter="filter"
    :loading="loading"
    :select-all="selectAll"
    :value="value"
    :pagination="pagination"
    :item-key="itemKey"
    @update:pagination="e => $emit('update:pagination', e)"
    @input="e => $emit('input', e)">
    <template
      slot="headers"
      slot-scope="props">
      <tr>
        <th v-if="enableSelect">
          <v-checkbox
            v-if="selectAll"
            :input-value="props.all"
            :indeterminate="props.indeterminate"
            color="primary"
            hide-details
            @click.native="toggleAll"/>
        </th>
        <th
          v-for="(header,i) in props.headers"
          :key="header.text"
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
    <template
      slot="items"
      slot-scope="props">
      <tr
        :active="props.selected"
        @click="props.selected = !props.selected">
        <td v-if="enableSelect">
          <v-checkbox
            :input-value="props.selected"
            color="primary"
            hide-details/>
        </td>
        <td
          v-for="({value: header, display},i) in vheaders"
          :class="header"
          :key="i"
          :colspan="i === vheaders.length-1 && !hasIcon(props.item)? 2:1"
          class="text-xs">
          <span v-if="props.item[header] == null"/>
          <span
            v-else-if="search || highlightText"
            v-html="highlight(props.item[header], display)"/>
          <span
            v-else-if="props.item[header].display !== undefined"
            v-html="props.item[header].display"/>
          <span
            v-else-if="display"
            v-html="display(props.item[header], props.item[header].text)"/>
          <span
            v-else
            :class="header"
            v-html="localeString(props.item[header], 'Date')"/>
        </td>
        <td
          v-if="hasIcon(props.item)"
          style="padding-right: 1.2rem"
          align="right">
          <action-icon
            v-for="(ai, i) in actionIcons"
            v-bind="ai"
            :key="i"
            :item="props.item"/>
        </td>
      </tr>
    </template>
    <template slot="footer">
      <slot name="footer"/>
    </template>
  </v-data-table>
</template>

<script>
import escapeRegExp from 'lodash.escaperegexp'
import actionIcon from 'components/action-icon.vue'

const sortOrder = {
  [Number]: 0,
  [Date]: 1,
  [String]: 2
}

export default {
  components: { actionIcon },
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    itemKey: {
      type: String,
      default: 'id'
    },
    pagination: {
      type: Object,
      default: () => {}
    },
    search: {
      type: String,
      default: null
    },
    actions: {
      type: Boolean,
      default: true
    },
    actionIcons: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    selectAll: {
      type: Boolean,
      default: false
    },
    enableSelect: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => []
    },
    highlightText: {
      type: String,
      default: ''
    }
  },
  data () {
    let vheaders = this.headers.map(header => {
      if (typeof header === 'string') {
        return { text: header, value: header }
      } else if (header.text === undefined) {
        return { text: header.value, ...header }
      } else {
        return header
      }
    })
    return {
      vheaders,
      selected: []
    }
  },
  computed: {
    searchRegex () {
      let text = this.highlightText || this.search
      try {
        return new RegExp(`(${text})`, 'ig')
      } catch (e) {
        return new RegExp(`(${escapeRegExp(text)})`, 'ig')
      }
    }
  },
  watch: {
    items () {
      this.$emit('input', [])
    }
  },
  methods: {
    customSort (items, index, sortDesc) {
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
    changeSort (column) {
      let { descending, sortBy } = this.pagination
      if (sortBy === column) { descending = !descending } else {
        sortBy = column
        descending = false
      }
      this.$emit('update:pagination', { ...this.pagination, descending, sortBy })
    },
    toggleAll () {
      if (this.value.length) this.$emit('input', [])
      else this.$emit('input', this.items.slice())
    },
    filter (value) {
      if (value != null && typeof value !== 'string') {
        if (value.search !== undefined) {
          value = value.search
        } else if (value.text !== undefined) {
          value = value.text
        }
      }
      return this.searchRegex.test(this.localeString(value, 'Date'))
    },
    highlight (value, display) {
      let highlightText = text => text.replace(this.searchRegex, '<mark>$1</mark>')
      if (display !== undefined) {
        let text = highlightText(value.text)
        return display(value, text)
      } else if (value.display) {
        return highlightText(value.display)
      } else {
        return highlightText(this.localeString(value, 'Date'))
      }
    },
    hasIcon (item) {
      return this.actionIcons &&
        !this.actionIcons
          .map(icon => icon.show(item))
          .every(show => !show)
    }
  }
}
</script>
