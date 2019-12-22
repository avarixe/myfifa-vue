<template lang="pug">
  v-card
    v-toolbar(:color="color" dark dense)
      v-toolbar-title.font-weight-light {{ title }}
      v-spacer
      v-btn(
        v-if="match"
        :to="match.link"
        dark
        nuxt
        text
      ) View Match
    template(v-if="match")
      v-card-text.text-center
        p.font-weight-thin.mb-0 {{ match.competition }}
        h4.title.font-weight-light.mt-0.mb-3
          | {{ match.home }} v {{ match.away }}
        h4.title.font-weight-light.mb-0 {{ match.score }}
        p.font-weight-thin.mt-0 {{ match.played_on | formatDate }}
    .text-center.pa-4(v-else)
      p.category.font-weight-thin.ma-0 No Matches have been Recorded.
</template>

<script>
  export default {
    name: 'MatchCard',
    props: {
      match: {
        type: Object,
        default: null
      },
      title: {
        type: String,
        default: null
      },
      color: {
        type: String,
        default: 'info'
      }
    }
  }
</script>
