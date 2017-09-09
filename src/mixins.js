import Vue from 'vue'
import { mapState } from 'vuex'
import filters from 'filters'

Vue.mixin({
  data() {
    return {
      pulling: false
    }
  },
  methods: {
    async getData(model, data) {
      return await this.$store.dispatch('getData', {model, data})
    },
    async pullData() {
      this.pulling = true
      let data = await this.getData(this.model)
      this.pulling = false
      if (data) this.setData(data)
    },
    log(){
      console.log.apply(null, arguments)
    },
    ...filters,
  },
  computed: {
    model() {
      return this.$route.fullPath
    },
    ...mapState(['userRole'])
  }
})
