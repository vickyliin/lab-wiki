import Vue from 'vue'
import mixin from './mixins'
import filters from './filters'

Vue.mixin(mixin)

Object.entries(filters).forEach(
  ([name, filter]) => Vue.filter(name, filter))
