<template>
  <div class="manage-panel" v-if="userRole === 'admin'">
    <v-btn fab small ripple outline
           v-for="(btn, i) in buttons" :key="i"
           :class="btn.color"
           :outline="btn.outline"
           @click.stop="btn.action">
      <v-icon>{{btn.icon}}</v-icon>
    </v-btn>
  </div>
</template>

<script>
  export default {
    props: ['dialog', 'selected', 'dialogs', 'setData'],
    data(){
      return {
        buttons: [
          {
            type: 'delete',
            icon: 'delete',
            outline: true,
            action: () => {
              if(!this.selected.length) return
              for(let {id} of this.selected)
                this.crud({type: 'delete', id})
            },
          },
          {
            type: 'create',
            icon: 'add',
            color: 'primary',
            action: () => {
              Object.assign(this.dialog, this.dialogs.create)
              this.dialog.display = true
            },
          }
        ],
      }
    },
  }
</script>


<style lang="stylus">
  .manage-panel
    position: fixed
    right: 1rem
    bottom: 1rem
</style>
