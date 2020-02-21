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
  export default {
    name: 'PlayersListCard',
    props: {
      players: { type: Array, default: () => [] },
      color: { type: String, default: 'primary' },
      title: { type: String, default: null }
    }
  }
</script>
