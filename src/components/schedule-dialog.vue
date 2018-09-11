<template>
  <v-dialog
    :width="width"
    :value="display"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    @input="e => $emit('update:display', e)">
    <v-card>
      <v-subheader class="pr-0">
        {{ title }}
        <v-layout hidden-sm-and-up>
          <v-spacer/>
          <v-btn
            icon
            flat
            @click="e => $emit('update:display', false)">
            <v-icon>close</v-icon>
          </v-btn>
        </v-layout>
      </v-subheader>
      <v-divider/>
      <v-container px-0>
        <!-- start date -->
        <v-layout
          pb-3
          wrap
          justify-center>
          <v-flex
            xs10
            sm8
            d-flex>
            <date-picker
              v-model="date"
              :required="true"
              :error="!date"
              label="Start Date"/>
          </v-flex>
        </v-layout>
        <!-- add member -->
        <v-layout
          pb-0
          wrap
          justify-center>
          <v-flex
            xs10
            sm8
            d-flex>
            <v-select
              v-model="selectedItems"
              :items="items"
              label="Select a member"
              prepend-icon="account_circle"
              max-height="20rem"
              return-object
              autocomplete
              hide-details
              hide-selected
              multiple
              @change="items => changeMember(items)">
              <template
                slot="item"
                slot-scope="data">
                <v-list-tile-content>
                  <v-list-tile-title>{{ data.item.name }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ data.item.account }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </template>
              <template
                slot="selection"
                slot-scope="data">{{
                  data.index ? '' : 'Add Member'
                }}</template>
            </v-select>
          </v-flex>
        </v-layout>
        <!-- reset/clear/submit -->
        <v-layout
          justify-center
          pb-2>
          <v-btn
            :loading="loading.reset"
            class="ma-0"
            flat
            @click="reset">Reset</v-btn>
          <v-btn
            class="ma-0"
            flat
            @click="clear">Clear</v-btn>
          <v-btn
            :loading="loading.submit"
            class="ma-0"
            color="primary"
            flat
            @click="submit">Submit</v-btn>
        </v-layout>
        <!-- drag board -->
        <v-layout px-5>
          <draggable
            v-model="selectedItems"
            :options="draggableOpt"
            :style="{width: '100%'}"
            @update="assignId">
            <transition-group
              :class="{column: $vuetify.breakpoint.smAndUp}"
              :style="{
                width: '100%',
                maxHeight: $vuetify.breakpoint.smAndUp ? '30rem' : null
              }"
              name="draggable"
              class="layout wrap">
              <v-flex
                v-for="(item, i) in selectedItems"
                :key="item.id"
                :px-3="$vuetify.breakpoint.xsOnly"
                class="items-tile"
                xs12
                d-flex
                align-center>
                <span>
                  <span class="pl-3 pr-2">
                    {{ item[idField] }}
                  </span>
                  {{ item.name }}
                </span>
                <span class="text-xs-right">
                  <v-btn
                    flat
                    icon
                    small
                    @click="() => selectedItems.splice(i, 1)">
                    <v-icon small>
                      close
                    </v-icon>
                  </v-btn>
                </span>
              </v-flex>
            </transition-group>
          </draggable>
        </v-layout>
      </v-container>
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
      type: [ String, Number ],
      default: null
    },
    display: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Schedule'
    },
    target: {
      type: String,
      default: null
    },
    idField: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      loading: {
        reset: false,
        submit: false
      },
      items: [],
      draggableOpt: {
        chosenClass: 'primary',
        dataIdAttr: 'id'
      },
      date: Date.now(),
      selectedItems: []
    }
  },
  computed: {
    model: () => '/contactList'
  },
  watch: {
    display (newVal) {
      if (newVal) this.crud()
    }
  },
  created () {
    this.crud()
  },
  methods: {
    setData (data) {
      data.forEach(d => { d.text = d.name + (d.account ? ' ' + d.account : '') })
      this.items = data
      this.selectedItems = data.filter(d => d[this.idField]).sort(
        (r, l) => {
          return r[this.idField] > l[this.idField] ? 1 : -1
        }
      )
    },
    assignId ({ oldIndex, newIndex }) {
      const step = oldIndex < newIndex ? 1 : -1
      for (let i = oldIndex; i !== newIndex + step; i += step) {
        this.selectedItems[i][this.idField] = i + 1
      }
    },
    changeMember (items) {
      // this may be a vuetify bug,
      // a default onchange event will be fired
      // only when one searches and then clicks a selection.
      if (items.constructor === Event) return
      items[items.length - 1][this.idField] = items.length
    },
    clear () {
      this.selectedItems = []
    },
    async reset () {
      this.loading.reset = true
      await this.crud()
      this.date = Date.now()
      this.loading.reset = false
    },
    async submit () {
      if (!this.date) return
      this.loading.submit = true
      let newData = await this.crud({
        type: 'update',
        path: this.target,
        id: 'schedule',
        readAfter: false,
        data: {
          idList: this.selectedItems.map(item => item.id),
          date: new Date(this.date).toJSON()
        }
      })
      this.$emit('submit', newData)
      this.$emit('update:display', false)
      this.loading.submit = false
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
