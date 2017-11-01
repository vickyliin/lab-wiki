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
          <v-list-tile v-for="item in items"
                       :key="item.id"
                       >
            <v-list-tile-content>{{ item.name }}</v-list-tile-content>
            <v-list-tile-action>
              <v-icon>delete</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat
               @click="reset">Reset</v-btn>
        <v-btn flat
               primary
               @click="submit"
               :loading="loading">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
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
      items: null
    }
  },
  created () {
    this.crud()
  },
  methods: {
    setData (data) {
      this.items = data.sort((r, l) => r.seminarId > l.seminarId ? 1 : -1)
    },
    submit () {
      return 0
    },
    reset () {
      this.crud()
    }
  },
  computed: {
    model: () => '/contactList'
  }
}
</script>
