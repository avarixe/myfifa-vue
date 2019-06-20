<template>
  <v-tooltip bottom>
    <template #activator="{ on }">
      <span v-on="($slots.tooltip || hint) && on">
        <v-badge color="transparent">
          <template #badge>
            <v-icon :color="color">
              mdi-link-variant
            </v-icon>
          </template>

          <slot>{{ text }}</slot>
          </slot>
        </v-badge>
      </span>
    </template>

    <slot name="tooltip">
      {{ hint }}
    </slot>
  </v-tooltip>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class BadgedLink extends Vue {
    @Prop(String) color
    @Prop(String) text
    @Prop(String) hint
  }
</script>
