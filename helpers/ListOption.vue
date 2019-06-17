<template>
  <v-list-item>
    <v-list-item-action v-if="optionAvatar">
      <v-list-item-action-text>
        {{ item[optionAvatar] }}
      </v-list-item-action-text>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title>
        {{ optionText ? item[optionText] : item }}
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class ListOption extends Vue {
    @Prop(null) item
    @Prop(String) optionAvatar
    @Prop(String) optionText
  }
</script>
