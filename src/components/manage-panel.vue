<template>
  <transition-group name="fade-transition" class="manage-panel" v-if="isAdmin">
    <span v-if="selected && selected.length"
          :key="0"
          v-tooltip:top="{ html: tooltipValue, visible: !!tooltipValue }">
      {{selected.length | localeString}} selected
    </span>
    <v-btn fab small ripple outline
           v-for="(btn, i) in buttons" :key="i+1"
           v-if="show[btn.type]"
           :class="btn.color"
           :outline="btn.outline"
           @click.stop="btn.action">
      <v-icon>{{btn.icon}}</v-icon>
    </v-btn>
  </transition-group>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Object,
      required: true
    },
    dialogs: {
      type: Object,
      required: true
    },
    setData: {
      type: Function,
      required: true
    },
    selected: {
      type: [Object, Array]
    },
    tooltip: {
      type: Function,
      default (items) {
        return items.map(
          item => this.localeString(item[this.title], 'Date')
        ).filter(x => x != null).join('\n')
      }
    },
    title: {
      type: String
    }
  },
  data () {
    return {
      buttons: [
        {
          type: 'delete',
          icon: 'delete',
          outline: true,
          action: () => {
            for (let { id } of this.selected) {
              this.crud({ type: 'delete', id })
            }
          }
        },
        {
          type: 'create',
          icon: 'add',
          color: 'primary',
          action: () => {
            Object.assign(this.dialog, this.dialogs.create)
            this.dialog.display = true
          }
        }
      ]
    }
  },
  computed: {
    show () {
      return {
        delete: !!(this.selected && this.selected.length),
        create: true
      }
    },
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
