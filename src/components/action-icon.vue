<template>
  <v-btn icon small
          v-if="show(item)"
          :href="href? href(item): ''"
          @click.stop="action(item)"
          style="margin: 0"
          :class="color? color+'--text': ''">
    <v-icon>{{icon}}</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
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
      type: Function
    }
  }
}
</script>
