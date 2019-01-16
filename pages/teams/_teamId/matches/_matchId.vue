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
        <match-form>
          <v-btn>
            <v-icon
              left
            >mdi-plus-circle-outline</v-icon>
            Match
          </v-btn>
        </match-form>
      </v-flex>

      <v-flex xs12>
        <material-card :color="resultColor">
          <template slot="header">
            <v-layout
              class="text-xs-center"
              row
              wrap
            >
              <v-flex xs12>
                <div
                  class="display-1"
                >{{ match.competition }}</div>
                <div
                  class="subheading"
                >{{ $_formatDate(match.date_played) }}</div>
              </v-flex>
              <v-flex xs12>
                <div
                  class="display-2"
                >{{ match.home }} v {{ match.away }}</div>
                <div class="display-1">
                  {{ match.score }}
                  {{ match.extra_time && !match.penalty_shootout ? '(AET)' : '' }}
                </div>
              </v-flex>
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
              ></match-actions>
            </v-flex>
            <v-flex
              xs12
              sm6
            >
              <match-timeline
                :match="match"
              ></match-timeline>
            </v-flex>
            <v-flex xs12 sm6>
              <match-lineup
                :match="match"
              ></match-lineup>
            </v-flex>
          </v-layout>
        </material-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex'
  import { Match, Player } from '@/models'
  import MatchForm from '@/components/Match/MatchForm'
  import MatchActions from '@/components/Match/MatchActions'
  import MatchLineup from '@/components/Match/MatchLineup'
  import MatchTimeline from '@/components/Match/Timeline'
  import MaterialCard from '@/components/theme/Card'
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    layout: 'team',
    components: {
      MatchForm,
      MatchActions,
      MatchLineup,
      MatchTimeline,
      MaterialCard
    },
    middleware: 'authenticated',
    mixins: [ TeamAccessible ],
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
        store.dispatch('entities/matches/GET', params),
        store.dispatch('entities/caps/FETCH', params),
        store.dispatch('entities/bookings/FETCH', params),
        store.dispatch('entities/goals/FETCH', params),
        store.dispatch('entities/substitutions/FETCH', params)
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
        getPlayers: 'entities/players/FETCH',
        getSquads: 'entities/squads/FETCH'
      })
    }
  }
</script>
