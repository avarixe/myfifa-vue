<template>
  <material-card
    color="cyan"
    :title="title"
  >
    <div
      v-if="match"
      class="text-xs-center"
    >
      <p class="my-2 text-xs-center">
        <v-btn
          :to="matchLink"
          nuxt
          color="cyan"
          outlined
        >View</v-btn>
      </p>

      <p class="font-weight-thin mb-0">{{ match.competition }}</p>
      <h4 class="title font-weight-light mt-0 mb-3">
        {{ match.home }} v {{ match.away }}
      </h4>

      <h4 class="title font-weight-light mb-0">{{ match.score }}</h4>
      <p class="font-weight-thin mt-0">
        {{ $_format($_parse(match.date_played), 'MMMM DD, YYYY') }}
      </p>
    </div>
    <div
      v-else
      class="text-xs-center"
    >
      <p class="category font-weight-thin">
        No Matches have been Recorded.
      </p>
    </div>
  </material-card>
</template>

<script>
  import MaterialCard from '@/helpers/theme/Card'

  export default {
    components: {
      MaterialCard
    },
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
