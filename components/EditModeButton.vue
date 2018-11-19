<template>
  <v-tooltip :color="color" bottom>
    <v-btn
      slot="activator"
      @click.stop="$emit('toggle-mode')"
      small
      icon>
      <v-icon
        :color="color"
        small
      >mdi-{{ icon }}</v-icon>
    </v-btn>
    {{ text }}
  </v-tooltip>
</template>

<script>
  export default {
    props: {
      mode: {
        type: Boolean,
        required: true
      },
      changed: Boolean
    },
    computed: {
      info () {
        if (!this.mode) {
          return { text: 'Edit', icon: 'pencil', color: 'orange' }
        } else if (this.changed) {
          return { text: 'Save', icon: 'content-save', color: 'green' }
        } else {
          return { text: 'Cancel', icon: 'close', color: 'black' }
        }
      },
      text () { return this.info.text },
      icon () { return this.info.icon },
      color () { return this.info.color }
    }
  }
</script>
