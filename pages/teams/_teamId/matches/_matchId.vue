<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout wrap>
      <v-flex xs12>
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">
          Match
          <small>v {{ match.opponent }}</small>
        </div>
      </v-flex>

      <v-flex xs12>
        <match-form />
      </v-flex>

      <v-layout
        class="text-xs-center"
        wrap
      >
        <v-flex xs12>
          <div class="display-2">
            <fitty-text :text="match.competition" />
          </div>
          <div
            v-if="match.stage"
            class="display-1"
          >
            <fitty-text
              :text="match.stage"
              :options="{ minSize: 10, maxSize: 30 }"
            />
          </div>
          <div class="subheading">
            {{ $_formatDate(match.date_played) }}
          </div>
        </v-flex>
        <v-layout
          class="display-1"
          justify-space-between
          align-center
        >
          <v-flex
            xs5
            class="font-weight-thin pa-3"
          >
            <fitty-text :text="match.home" />
            <div :class="`${resultColor}--text font-weight-bold`">
              {{ match.home_score }}
              <span v-if="match.penalty_shootout">
                ({{ match.penalty_shootout.home_score }})
              </span>
            </div>
          </v-flex>
          <v-flex
            xs5
            class="font-weight-thin pa-3"
          >
            <fitty-text :text="match.away" />
            <div :class="`${resultColor}--text font-weight-bold`">
              {{ match.away_score }}
              <span v-if="match.penalty_shootout">
                ({{ match.penalty_shootout.away_score }})
              </span>
            </div>
          </v-flex>
        </v-layout>

        <v-flex xs12>
          <match-actions
            v-if="match.date_played === team.current_date"
            :match="match"
          />
        </v-flex>
      </v-layout>

      <v-flex
        xs12
        sm6
      >
        <v-card outlined>
          <v-card-title class="subtitle-1 d-block text-xs-center">
            Timeline
          </v-card-title>
          <v-divider class="mx-3" />
          <v-card-text>
            <match-timeline :match="match" />
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex
        xs12
        sm6
      >
        <v-card outlined>
          <v-card-title class="subtitle-1 d-block text-xs-center">
            Lineup
          </v-card-title>
          <v-divider class="mx-3" />
          <v-card-text>
            <match-lineup :match="match" />
          </v-card-text>
        </v-card>
      </v-flex>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { Match, Player } from '@/models'
  import MatchForm from '@/components/Match/MatchForm'
  import MatchActions from '@/components/Match/MatchActions'
  import MatchLineup from '@/components/Match/MatchLineup'
  import MatchTimeline from '@/components/Match/Timeline'
  import { FittyText } from '@/helpers'
  import { TeamAccessible } from '@/mixins'

  export default {
    layout: 'team',
    components: {
      FittyText,
      MatchForm,
      MatchActions,
      MatchLineup,
      MatchTimeline
    },
    middleware: 'authenticated',
    mixins: [
      TeamAccessible
    ],
    head () {
      return {
        title: `${this.match.home} vs ${this.match.away}`
      }
    },
    computed: {
      match () {
        return Match
          .query()
          .withAll()
          .find(this.$route.params.matchId)
      },
      players () {
        return Player
          .query()
          .where('team_id', this.team.id)
          .get()
      },
      resultColor () {
        switch (this.match.team_result) {
          case 'win':
            return 'success'
          case 'draw':
            return 'warning'
          case 'loss':
            return 'red'
          default:
            return ''
        }
      }
    },
    async fetch ({ store, params }) {
      // await Promise.all([
      //   store.dispatch('caps/FETCH', params),
      //   store.dispatch('bookings/FETCH', params),
      //   store.dispatch('goals/FETCH', params),
      //   store.dispatch('substitutions/FETCH', params)
      // ])
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    },
    watch: {
      match (val) {
        !val && this.$router.push({
          name: 'teams-teamId-matches',
          params: { teamId: this.team.id }
        })
      }
    }
  }
</script>
