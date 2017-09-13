<template>
  <v-container>
    <v-layout column>
      <transition-group name="slide-y" tag="div">
        <v-flex v-for="(news,i) in displayData" :key="i">
          <v-container @click="news.selected = !news.selected">
            <v-layout mb-2>
              <v-checkbox primary
                          hide-details
                          v-if="isAdmin"
                          :input-value="news.selected"
                          :label="news.title"
                          style="padding: 0"></v-checkbox>
              <span class="title" v-else>{{news.title}}</span>
              <action-icon v-bind="editIcon"
                          v-if="isAdmin"
                          :item="news"> </action-icon>
            </v-layout>
              <v-subheader>{{news.date | localeString('Date')}}</v-subheader>
            <v-container>
              <vue-markdown :source="news.content"></vue-markdown>
            </v-container>
            <v-divider></v-divider>
          </v-container>
        </v-flex>
      </transition-group>
    </v-layout>
    <form-dialog :title="dialog.title"
                 :fields="dialog.fields"
                 :display.sync="dialog.display"
                 v-model="dialog.value"
                 @submit="dialog.onSubmit"
                 width="70%">
    </form-dialog>
    <manage-panel :dialog="dialog" :dialogs="dialogs"
                  :setData="setData" title="date"
                  :selected="selectedItems"></manage-panel>
  </v-container>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import formDialog from 'components/form-dialog.vue'
import managePanel from 'components/manage-panel.vue'
import actionIcon from 'components/action-icon.vue'

const autoText = 'Congratulations to'

export default{
  components: { VueMarkdown, managePanel, formDialog, actionIcon },
  data () {
    return {
      data: [],
      dialog: {
        title: null,
        fields: [
          { name: 'title', label: 'Title', icon: 'title', required: true, component: 'v-text-field' },
          { name: 'date', label: 'Date', component: 'date-picker' },
          { name: 'content', label: 'News Content', multiLine: true, component: 'v-text-field' }
        ],
        value: null,
        onSubmit: this.updateData,
        display: false,
        item: null
      },
      editIcon: {
        icon: 'edit',
        color: 'teal',
        action: item => {
          this.dialogs.item = item
          Object.assign(this.dialog, this.dialogs.update)
          this.dialog.display = true
        }
      },
      dialogs: {
        item: { },
        updateData: this.updateData,
        localeString: this.localeString,
        create: {
          title: 'Add News',
          value: {
            title: autoText,
            date: this.localeString(new Date(), 'Date'),
            content: autoText
          },
          item: null
        },
        get update () {
          let item = this.item
          return {
            title: 'Update News',
            item,
            value: item
          }
        }
      }
    }
  },
  created () {
    this.crud()
  },
  methods: {
    async setData (data) {
      this.data = data.sort((r, l) => {
        r = Date.parse(r.date)
        l = Date.parse(l.date)
        if (r === l) return 0
        if (r < l) return 1
        return -1
      }).map(d => ({...d, selected: false}))
    },
    async updateData (resolve) {
      let data = this.dialog.value
      let id = this.dialog.item ? this.dialog.item.id : undefined
      await this.crud({ type: 'post', data, id })
      resolve()
    }
  },
  computed: {
    displayData () {
      return this.data.slice(0, 10)
    },
    selectedItems () {
      return this.data.filter(d => d.selected)
    }
  }
}
</script>
