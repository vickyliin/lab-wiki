<template>
  <v-btn icon
         small
         v-if="show(item)"
         :href="href? href(item): ''"
         @click.stop="action(item)"
         @mousedown.stop
         @dragenter.stop
         @pointerdown.stop
         style="margin: 0"
         :class="color+'--text'">
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
      type: String
    },
    show: {
      type: Function,
      default: () => true
    },
    href: {
      type: Function
    },
    action: {
      type: Function,
      default: () => {}
    }
  }
}
</script>
