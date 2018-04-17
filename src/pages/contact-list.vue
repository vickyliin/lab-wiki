<template>
  <v-container>
    <v-layout>
      <v-spacer/>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details/>
    </v-layout>
    <transition-group
      id="contact-layout"
      name="slide-y"
      tag="div"
      class="layout">
      <v-card
        v-for="person in filteredData"
        :key="person.id"
        :class="{link: isAdmin}"
        class="contact-card">
        <v-container
          pa-3
          @click="person.selected = !person.selected">
          <v-layout mb-1>
            <v-checkbox
              v-if="isAdmin"
              :label="person.name"
              :input-value="person.selected"
              style="padding: 0"
              color="primary"
              hide-details/>
            <span
              v-else
              class="title">
              {{ person.name }}
            </span>
            <v-spacer/>
            <action-icon
              v-if="isAdmin"
              v-bind="editIcon"
              :item="person"/>
          </v-layout>
          <v-divider/>
          <v-list>
            <v-list-tile
              v-for="field in fields"
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
    <form-dialog
      v-model="dialog.value"
      :title="dialog.title"
      :fields="dialog.fields"
      :display.sync="dialog.display"
      width="35rem"
      @submit="dialog.onSubmit"/>
    <manage-panel
      :dialog="dialog"
      :dialogs="dialogs"
      :set-data="setData"
      :selected="selectedItems"
      title="name"/>
  </v-container>
</template>

<script>
import debounce from 'lodash.debounce'
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
    search: debounce(function () {
      this.debouncedSearch = this.search
    }, 500)
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
