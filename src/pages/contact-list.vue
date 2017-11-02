<template>
  <v-container>
    <v-layout>
      <v-spacer></v-spacer>
      <v-text-field append-icon="search"
                    label="Search"
                    single-line
                    hide-details
                    v-model="search"></v-text-field>
    </v-layout>
    <transition-group name="slide-y"
                      tag="div"
                      class="layout"
                      id="contact-layout">
      <v-card v-for="person in filteredData"
              :key="person.id"
              class="contact-card"
              :class="{link: isAdmin}"
              @click="person.selected = !person.selected">
        <v-container>
          <v-layout mb-1>
            <v-checkbox color="primary"
                        hide-details
                        v-if="isAdmin"
                        :label="person.name"
                        :input-value="person.selected"
                        style="padding: 0"></v-checkbox>
            <span class="title"
                  v-else>
              {{ person.name }}
            </span>
            <v-spacer></v-spacer>
            <action-icon v-bind="editIcon"
                         v-if="isAdmin"
                         :item="person"> </action-icon>
          </v-layout>
          <v-divider></v-divider>
          <v-list>
            <v-list-tile v-for="field in fields"
                         :key="field.name"
                         :href="field.href? field.href(person[field.name]): undefined">
              <v-list-tile-action>
                <v-icon>{{ field.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                {{ person[field.name] }}
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-container>
      </v-card>
    </transition-group>
    <form-dialog :title="dialog.title"
                 :fields="dialog.fields"
                 :display.sync="dialog.display"
                 v-model="dialog.value"
                 @submit="dialog.onSubmit"
                 width="35rem">
    </form-dialog>
    <manage-panel :dialog="dialog"
                  :dialogs="dialogs"
                  :set-data="setData"
                  title="name"
                  :selected="selectedItems"></manage-panel>
  </v-container>
</template>

<script>
import _ from 'lodash'
import formDialog from 'components/form-dialog.vue'
import managePanel from 'components/manage-panel.vue'
import actionIcon from 'components/action-icon.vue'

export default {
  components: { formDialog, managePanel, actionIcon },
  data () {
    return {
      contactData: [],
      fields: [
        { name: 'account', icon: 'account_circle' },
        { name: 'email', icon: 'email' },
        { name: 'phone', icon: 'phone', href: phone => 'tel:' + phone }
      ],
      editIcon: {
        icon: 'edit',
        color: 'teal',
        action: item => {
          this.dialogs.item = item
          Object.assign(this.dialog, this.dialogs.update)
          this.dialog.display = true
        }
      },
      dialog: {
        title: null,
        fields: [
          { name: 'name', label: 'Name', icon: 'email', required: true, component: 'v-text-field' },
          { name: 'account', label: 'Account', icon: 'account_circle', component: 'v-text-field' },
          { name: 'email', label: 'Email', icon: 'email', type: 'emial', component: 'v-text-field' },
          { name: 'phone', label: 'Phone', icon: 'phone', type: 'phone', component: 'v-text-field' }
        ],
        value: null,
        onSubmit: this.updateData,
        display: false,
        item: null
      },
      dialogs: {
        item: { topic: {} },
        updateData: this.updateData,
        localeString: this.localeString,
        create: {
          title: 'Add Contact',
          value: null,
          item: null
        },
        get update () {
          let item = this.item
          return {
            title: 'Update Contact',
            item,
            value: item
          }
        }
      },
      search: '',
      debouncedSearch: ''
    }
  },
  created () {
    this.crud()
  },
  methods: {
    async setData (data) {
      this.contactData = data.map(d => ({
        ...d,
        selected: false
      }))
    },
    async updateData (resolve) {
      let data = this.dialog.value
      let id = this.dialog.item ? this.dialog.item.id : undefined
      await this.crud({ type: 'post', data, id })
      resolve()
    }
  },
  computed: {
    filteredData () {
      return this.contactData.filter(person => {
        for (let key in person) {
          if (!person[key]) continue
          if (person[key].toString().indexOf(this.debouncedSearch) !== -1) { return true }
        }
        return false
      })
    },
    selectedItems () {
      return this.contactData.filter(d => d.selected)
    }
  },
  watch: {
    search: _.debounce(function () {
      this.debouncedSearch = this.search
    }, 500)
  }
}
</script>

<style lang="stylus">
  #contact-layout
    flex-wrap: wrap
    justify-content: space-around
  .contact-card
    flex-basis: 25rem
    margin: 2rem
    >.container>.layout
      align-items: center
    .list__tile
      height: 2.3rem
      font-size: inherit
    h6
      font-weight: normal
</style>
