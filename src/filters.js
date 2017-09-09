import Vue from 'vue'
import { timeLocaleFormat } from 'config'

let filters = {
  localeString(data) {
    if (!data && data !== 0) return ''
    if (data.toLocaleString) return data.toLocaleString(timeLocaleFormat)
    else return data
  },
  formatDate(data) {
    if (isNaN(Date.parse(data))) return ''
    else return new Date(data).toLocaleDateString(timeLocaleFormat)
  },
  spaceSeparated(camelCased) {
    return camelCased.replace(/(\B[A-Z])/g, ' $1')
      .replace(/^./, match => match.toUpperCase())
  }
}

Object.entries(filters)
  .forEach(([name, filter]) => Vue.filter(name, filter))

export { filters as default }
