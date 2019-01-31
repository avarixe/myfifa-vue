<template>
  <v-tooltip
    :color="color"
    :right="dir === 'right'"
    :left="dir === 'left'"
    :top="dir === 'top'"
    :bottom="dir === 'bottom'"
  >
    <v-btn
      slot="activator"
      small
      icon
      @click.stop="$emit('toggle-mode')"
    >
      <v-icon
        :color="color"
        small
        v-text="`mdi-${icon}`"
      />
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
      dir: {
        type: String,
        default: 'bottom'
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
