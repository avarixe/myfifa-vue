<template>
  <v-tooltip
    :color="color"
    bottom
  >
    <template #activator="{ on: tooltip }">
      <v-btn
        icon
        :to="to"
        v-on="on ? { ...on, ...tooltip } : tooltip"
        @click="$emit('click')"
      >
        <v-icon
          :color="color"
          :dark="dark"
        >
          {{ icon }}
        </v-icon>
      </v-btn>
    </template>
    {{ label }}
  </v-tooltip>
</template>

<script>
  export default {
    name: 'TooltipButton',
    props: {
      label: { type: String, default: null },
      icon: { type: String, default: null },
      color: { type: String, default: null },
      dark: { type: Boolean, default: null },
      to: { type: Object, default: null },
      on: { type: null, default: null }
    }
  }
</script>
