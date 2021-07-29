<template>
  <v-card>
    <v-toolbar
      :color="color"
      dark
      dense
    >
      <v-toolbar-title class="font-weight-light">{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-btn
        v-if="match"
        :to="match.link"
        dark
        nuxt
        text
      >
        View Match
      </v-btn>
    </v-toolbar>
    <template v-if="match">
      <v-card-text class="text-center font-weight-light">
        <div class="mb-0">{{ match.competition }}</div>
        <div class="text-h6 mt-0 mb-3">{{ match.home }} v {{ match.away }}</div>
        <div class="text-h6 mb-0">{{ match.score }}</div>
        <div class="mt-0 mb-2">{{ match.playedOn | formatDate }}</div>
      </v-card-text>
    </template>
    <div
      v-else
      class="text-center pa-4"
    >
      <p class="category font-weight-light ma-0">
        No Matches have been Recorded.
      </p>
    </div>
  </v-card>
</template>

<script>
  export default {
    name: 'MatchCard',
    props: {
      match: { type: Object, default: null },
      title: { type: String, default: null },
      color: { type: String, default: 'info' }
    }
  }
</script>
