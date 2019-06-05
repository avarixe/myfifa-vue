<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout
      row
      wrap
    >
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

      <v-flex xs12>
        <material-card :color="resultColor">
          <template #header>
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
                  <fitty-text :text="match.stage" />
                </div>
                <div class="subheading">
                  {{ $_formatDate(match.date_played) }}
                </div>
              </v-flex>
              <v-layout
                class="display-1"
                row
                justify-space-between
                align-center
              >
                <v-flex
                  xs5
                  class="font-weight-thin pa-3"
                >
                  <fitty-text :text="match.home" />
                  <div>
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
                  <div>
                    {{ match.away_score }}
                    <span v-if="match.penalty_shootout">
                      ({{ match.penalty_shootout.away_score }})
                    </span>
                  </div>
                </v-flex>
              </v-layout>
            </v-layout>
          </template>

          <v-layout
            row
            wrap
          >
            <v-flex xs12>
              <match-actions
                v-if="match.date_played === team.current_date"
                :match="match"
              />
            </v-flex>
            <v-flex
              xs12
              sm6
            >
              <match-timeline :match="match" />
            </v-flex>
            <v-flex
              xs12
              sm6
            >
              <match-lineup :match="match" />
            </v-flex>
          </v-layout>
        </material-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex'
  import {
    Match,
    Player
  } from '@/models'
  import MatchForm from '@/components/Match/MatchForm'
  import MatchActions from '@/components/Match/MatchActions'
  import MatchLineup from '@/components/Match/MatchLineup'
  import MatchTimeline from '@/components/Match/Timeline'
  import { FittyText, MaterialCard } from '@/helpers'
  import { TeamAccessible } from '@/mixins'

  export default {
    layout: 'team',
    components: {
      FittyText,
      MatchForm,
      MatchActions,
      MatchLineup,
      MatchTimeline,
      MaterialCard
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
      await Promise.all([
        store.dispatch('matches/GET', params),
        store.dispatch('caps/FETCH', params),
        store.dispatch('bookings/FETCH', params),
        store.dispatch('goals/FETCH', params),
        store.dispatch('substitutions/FETCH', params)
      ])
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
      this.getPlayers({ teamId: this.team.id })
      this.getSquads({ teamId: this.team.id })
    },
    watch: {
      match (val) {
        !val && this.$router.push({
          name: 'teams-teamId-matches',
          params: { teamId: this.team.id }
        })
      }
    },
    methods: {
      ...mapActions({
        getPlayers: 'players/FETCH',
        getSquads: 'squads/FETCH'
      })
    }
  }
</script>
