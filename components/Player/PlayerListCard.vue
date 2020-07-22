<template>
  <v-card>
    <v-toolbar
      :color="color"
      dark
      dense
    >
      <v-toolbar-title class="font-weight-light">
        {{ title }}
      </v-toolbar-title>
    </v-toolbar>
    <v-list
      nav
      dense
    >
      <v-subheader>Player</v-subheader>
      <v-list-item
        v-for="player in players"
        :key="player.id"
        :to="player.link"
        nuxt
      >
        <v-list-item-action>
          <v-list-item-action-text>{{ player.pos }}</v-list-item-action-text>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ player.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
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
