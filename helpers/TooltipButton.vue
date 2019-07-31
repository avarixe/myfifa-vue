<template>
  <v-tooltip
    :color="color"
    bottom
  >
    <template #activator="{ on: tooltip }">
      <v-btn
        icon
        :small="small"
        :to="to"
        v-on="on ? { ...on, ...tooltip } : tooltip"
        @click="$emit('click')"
      >
        <v-icon :color="color">{{ icon }}</v-icon>
      </v-btn>
    </template>
    {{ label }}
  </v-tooltip>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class TooltipButton extends Vue {
    @Prop(String) label
    @Prop(String) icon
    @Prop(String) color
    @Prop(Boolean) small
    @Prop(Object) to
    @Prop() on
  }
</script>
