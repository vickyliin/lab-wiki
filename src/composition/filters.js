import Vue from 'vue'
import { timeLocaleFormat } from 'config'

let filters = {
  localeString(data, addon='') {
    if (data == null) return ''
    if (typeof data !== 'number' && Date.parse(data)) return new Date(data)[`toLocale${addon}String`](timeLocaleFormat)
    if (data.toLocaleString) return data.toLocaleString()
    else return data
  },
  spaceSeparated(camelCased) {
    return camelCased.replace(/(\B[A-Z])/g, ' $1')
      .replace(/^./, match => match.toUpperCase())
  }
}

Object.entries(filters)
  .forEach(([name, filter]) => Vue.filter(name, filter))

export { filters as default }
