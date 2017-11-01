<template>
  <v-dialog :width="width"
            :value="display"
            @input="e => $emit('update:display', e)">
    <v-card>
      <v-card-title>
        <v-container class="headline"
                     fluid>
          {{ title }}
        </v-container>
      </v-card-title>
      <v-card-text>
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
                <v-list-tile-content :class="{ 'grey--text': !item.seminarId }">{{ item.name }}</v-list-tile-content>
                <v-list-tile-action>
                  <action-icon v-if="item.seminarId"
                               icon="clear"
                               color="error" />
                </v-list-tile-action>
              </v-list-tile>
            </transition-group>
          </draggable>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat
               @click="crud()">Reset</v-btn>
        <v-btn flat
               primary
               @click="submit"
               :loading="loading">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import draggable from 'vuedraggable'
import actionIcon from 'components/action-icon.vue'

export default {
  components: { draggable, actionIcon },
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
    }
  },
  data () {
    return {
      loading: false,
      items: null,
      draggableOpt: {
        chosenClass: 'primary',
        dragClass: 'white--text',
        dataIdAttr: 'id'
      }
    }
  },
  created () {
    this.crud()
  },
  methods: {
    setData (data) {
      this.items = data.sort((r, l) => {
        if (r.seminarId === 0) return 1
        if (l.seminarId === 0) return -1
        return r.seminarId > l.seminarId ? 1 : -1
      })
    },
    assignId ({ newIndex, oldIndex }) {
      for (let i = 0; i <= newIndex || i <= oldIndex; i++) {
        this.items[i].seminarId = i + 1
      }
    },
    submit () {
      return 0
    }
  },
  computed: {
    model: () => '/contactList'
  }
}
</script>
<style lang="stylus" scoped>
.items-tile
  cursor move
.draggable-move
  transition transform 0.3s
</style>

