<template lang="pug">
  v-card
    v-toolbar(:color="color" dark dense)
      v-toolbar-title.font-weight-light {{ title }}
    v-list(nav dense)
      v-subheader Player
      v-list-item(
        v-for="player in players"
        :key="player.id"
        :to="player.link"
        nuxt
      )
        v-list-item-action
          v-list-item-action-text {{ player.pos }}
        v-list-item-content
          v-list-item-title {{ player.name }}
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class PlayersListCard extends Vue {
    @Prop({ type: Array, default: [] }) players
    @Prop({ type: String, default: 'primary' }) color
    @Prop(String) title
  }
</script>
