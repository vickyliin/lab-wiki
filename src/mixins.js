import Vue from 'vue'
import {mapActions, mapState} from 'vuex'

Vue.mixin({
  data(){return{
    pulling: false
  }},
  methods: {
    ...mapActions(['getData']),
    async pullData(){
      this.pulling = true
      let data = await this.getData(this.model)
      this.pulling = false
      if(data) this.setData(data)
    },
  },
  computed: {
    model(){
      return this.$route.fullPath
    },
    ...mapState(['userRole'])
  }
})