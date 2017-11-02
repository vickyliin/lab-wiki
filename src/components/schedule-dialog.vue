<template>
  <v-dialog :width="width"
            :value="display"
            @input="e => $emit('update:display', e)">
    <v-card>
      <v-card-title>
        <v-container class="headline pb-0"
                     fluid>
          {{ title }}
        </v-container>
      </v-card-title>
      <v-card-text>
        <v-container pb-0 pt-3 pl-3 fluid>
          <date-picker label="Start Date"
                       v-model="date"
                       :required="true"
                       :error="!date" />
        </v-container>
        <v-list>
          <draggable v-model="items"
                     :options="draggableOpt"
                     @update="assignId">
            <transition-group name="draggable">
              <v-list-tile v-for="item in items"
                          :key="item.id"
                          class="items-tile">
                <v-list-tile-action>
                  {{ item.seminarId || '' }}
                </v-list-tile-action>
                <v-list-tile-content>{{ item.name }}</v-list-tile-content>
                <v-list-tile-action>
                  <action-icon v-if="item.seminarId"
                               icon="delete"
                               color="grey"
                               :item="item"
                               :action="changeItem({ item, newId: 0 })" />

                  <action-icon v-else
                               icon="add"
                               color="primary"
                               :item="item"
                               :action="changeItem({ item, newId: nActivate + 1 })" />
                </v-list-tile-action>
              </v-list-tile>
            </transition-group>
          </draggable>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat
               @click="reset"
               :loading="loading.reset">Reset</v-btn>
        <v-btn flat
               primary
               @click="submit"
               :loading="loading.submit">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import draggable from 'vuedraggable'
import actionIcon from 'components/action-icon.vue'
import datePicker from 'components/date-picker.vue'

export default {
  components: { draggable, actionIcon, datePicker },
  props: {
    width: {
      type: [ String, Number ]
    },
    display: {
      type: Boolean
    },
    title: {
      type: String
    },
    value: {
      type: Array
    },
    target: {
      type: String
    }
  },
  data () {
    return {
      loading: {
        reset: false,
        submit: false
      },
      items: null,
      draggableOpt: {
        chosenClass: 'primary',
        dataIdAttr: 'id'
      },
      date: null
    }
  },
  created () {
    this.crud()
  },
  methods: {
    setData (data) {
      this.items = data.sort((r, l) => {
        if (r.seminarId === l.seminarId) return 0
        if (r.seminarId === 0) return 1
        if (l.seminarId === 0) return -1
        return r.seminarId > l.seminarId ? 1 : -1
      })
    },
    assignId ({ newIndex }) {
      this.items[newIndex].seminarId = newIndex + 1
      this.setData(this.items)
      let n = this.nActivate
      for (let i = 0; i < n; i++) {
        this.items[i].seminarId = i + 1
      }
    },
    changeItem ({ item, newId }) {
      return item => {
        item.seminarId = newId
        this.setData(this.items)
        if (this.nActivate) this.assignId({ newIndex: this.nActivate - 1 })
      }
    },
    async reset () {
      this.loading.reset = true
      await this.crud()
      this.date = null
      this.loading.reset = false
    },
    async submit () {
      if (!this.date) return
      this.loading.submit = true
      let newData = await this.crud({
        type: 'update',
        path: this.target,
        id: 'schedule',
        data: {
          idList: this.items.slice(0, this.nActivate).map(item => item.id),
          date: new Date(this.date).toJSON()
        }
      })
      this.$emit('submit', newData)
      this.$emit('update:display', false)
      this.loading.submit = false
    }
  },
  computed: {
    model: () => '/contactList',
    nActivate () {
      return this.items.reduce((pre, cur) => pre + !!cur.seminarId, 0)
    }
  },
  watch: {
    display (newVal) {
      if (newVal) this.crud()
    }
  }
}
</script>
<style lang="stylus" scoped>
.items-tile
  cursor move
.draggable-move
  transition transform 0.3s
</style>
