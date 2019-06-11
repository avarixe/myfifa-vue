<template>
  <v-card outlined>
    <v-card-title
      :class="`title font-weight-light cyan--text`"
    >{{ title }}</v-card-title>

    <v-divider class="mx-3" />

    <template v-if="match">
      <v-card-actions>
        <v-btn
          :to="matchLink"
          nuxt
          color="cyan"
          block
          text
        >View Match</v-btn>
      </v-card-actions>

      <v-card-text class="text-xs-center">
        <p class="font-weight-thin mb-0">{{ match.competition }}</p>
        <h4 class="title font-weight-light mt-0 mb-3">
          {{ match.home }} v {{ match.away }}
        </h4>

        <h4 class="title font-weight-light mb-0">{{ match.score }}</h4>
        <p class="font-weight-thin mt-0">
          {{ $_format($_parse(match.date_played), 'MMMM DD, YYYY') }}
        </p>
      </v-card-text>
    </template>
    <div
      v-else
      class="text-xs-center"
    >
      <p class="category font-weight-thin">
        No Matches have been Recorded.
      </p>
    </div>
  </v-card>
</template>

<script>
  export default {
    props: {
      match: Object,
      title: String
    },
    computed: {
      matchLink () {
        return {
          name: 'teams-teamId-matches-matchId',
          params: {
            teamId: this.match.team_id,
            matchId: this.match.id
          }
        }
      }
    }
  }
</script>
