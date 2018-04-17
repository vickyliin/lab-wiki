<template>
  <transition-group
    v-if="isAdmin"
    name="fade-transition"
    class="manage-panel">
    <v-tooltip
      :key="0"
      :debounce="0"
      left>
      <div
        v-for="v in tooltipValue"
        :key="v">
        {{ v }}
      </div>
      <span
        v-if="selected && selected.length"
        slot="activator"
        flat>
        {{ selected.length | localeString }} selected
      </span>
    </v-tooltip>
    <v-btn
      v-for="(btn, i) in buttons"
      v-if="show(btn.name)"
      :key="i+1"
      :color="btn.color"
      :outline="btn.outline"
      fab
      small
      ripple
      @click.stop="btn.action">
      <v-icon>{{ btn.icon }}</v-icon>
    </v-btn>
  </transition-group>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Object,
      default: null
    },
    dialogs: {
      type: Object,
      default: null
    },
    setData: {
      type: Function,
      default: null
    },
    selected: {
      type: [Object, Array],
      default: null
    },
    tooltip: {
      type: Function,
      default (items) {
        return items.map(
          item => this.localeString(item[this.title], 'Date')
        ).filter(x => x != null)
      }
    },
    title: {
      type: String,
      default: ''
    },
    schedule: {
      type: Boolean,
      default: false
    },
    show: {
      type: Function,
      default (name) {
        return {
          delete: !!(this.selected && this.selected.length),
          create: true,
          schedule: this.schedule
        }[name]
      }
    },
    buttons: {
      type: Array,
      default () {
        return [
          {
            name: 'delete',
            icon: 'delete',
            outline: true,
            action: () => {
              for (let { id } of this.selected) {
                this.crud({ type: 'delete', id })
              }
            }
          },
          {
            name: 'create',
            icon: 'add',
            color: 'primary',
            action: () => {
              Object.assign(this.dialog, this.dialogs.create)
              this.dialog.display = true
            }
          },
          {
            name: 'schedule',
            icon: 'mdi-calendar',
            color: 'success',
            action: () => {
              Object.assign(this.dialog, this.dialogs.schedule)
              this.dialog.display = true
            }
          }
        ]
      }
    }
  },
  computed: {
    tooltipValue () {
      return this.tooltip(this.selected)
    }
  }
}
</script>

<style lang="stylus">
  .manage-panel
    position: fixed
    right: 1rem
    bottom: 1rem
</style>
