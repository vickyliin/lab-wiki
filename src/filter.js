import Vue from 'vue'
import {timeLocaleFormat} from 'config'

Vue.filter('localeString', data => {
  if(!data && data !== 0) return ''
  if(data.toLocaleString) return data.toLocaleString(timeLocaleFormat)
  else return data
})
Vue.filter('date', data => {
  let date = new Date(data)
  if(date === 'Invalid Date') return ''
  else return date.toLocaleDateString(timeLocaleFormat)
})
Vue.filter('spaceSeparated', camelCased => camelCased
    .replace(/(\B[A-Z])/g, ' $1')
    .replace(/^./, match => match.toUpperCase()))