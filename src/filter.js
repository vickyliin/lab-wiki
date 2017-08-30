import Vue from 'vue'
import {timeLocaleFormat} from 'config'

Vue.filter('localeString', data => {
  if(!data) return ''
  if(data.toLocaleString) return data.toLocaleString(timeLocaleFormat)
  else return data
})
Vue.filter('date', data => {
  let date = new Date(data)
  if(date === 'Invalid Date') return ''
  else return date.toLocaleDateString(timeLocaleFormat)
})
Vue.filter('spaceSeparated', camelCased => camelCased
    .replace(/(\B[A-Z])/, ' $1')
    .replace(/^./, match => match.toUpperCase()))