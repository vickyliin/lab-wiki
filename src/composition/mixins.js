import { mapState } from 'vuex'
import store from 'store'
import filters from './filters'

let { dispatch } = store

export default {
  data () {
    return {
      pulling: false
    }
  },
  methods: {
    async crud ({type = 'read', path = this.model, data, id} = {}) {
      this.pulling = true
      let response = await dispatch('crud', { type, path, data, id })
      this.pulling = false
      if (!response) return
      if (path === this.model) this.setData(response)
      return response
    },
    log () {
      if (process.env.NODE_ENV === 'development') {
        console.log.apply(null, arguments)
      }
    },
    ...filters
  },
  computed: {
    model () {
      return this.$route.path
    },
    ...mapState(['userRole']),
    isAdmin () {
      return this.userRole === 'admin'
    }
  }
}
