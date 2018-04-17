<template>
  <v-btn
    v-if="show(item)"
    :href="href(item)"
    :class="color+'--text'"
    style="margin: 0"
    icon
    small
    @click.stop="action(item)"
    @mousedown.stop
    @dragenter.stop
    @pointerdown.stop>
    <v-icon>{{ icon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null
    },
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: ''
    },
    show: {
      type: Function,
      default: () => true
    },
    href: {
      type: Function,
      default: () => undefined
    },
    action: {
      type: Function,
      default: () => {}
    }
  }
}
</script>
