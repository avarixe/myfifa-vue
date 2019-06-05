<template>
  <v-tooltip
    :color="info.color"
    :right="dir === 'right'"
    :left="dir === 'left'"
    :top="dir === 'top'"
    :bottom="dir === 'bottom'"
  >
    <template #activator="{ on }">
      <v-btn
        v-on="!text && on"
        small
        :color="text ? info.color : null"
        dark
        :icon="!text"
        @click.stop="$emit('toggle-mode')"
      >
        <v-icon
          v-if="!text"
          :color="info.color"
          small
        >mdi-{{ info.icon }}</v-icon>
        <span v-if="text">{{ info.text }}</span>
      </v-btn>
    </template>
    {{ info.text }}
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
      text: {
        type: Boolean,
        default: false
      },
      changed: Boolean
    },
    computed: {
      info () {
        if (!this.mode) {
          return {
            text: 'Edit',
            icon: 'pencil',
            color: 'orange'
          }
        } else if (this.changed) {
          return {
            text: 'Save',
            icon: 'content-save',
            color: 'green'
          }
        } else {
          return {
            text: 'Cancel',
            icon: 'close',
            color: 'black'
          }
        }
      }
    }
  }
</script>
