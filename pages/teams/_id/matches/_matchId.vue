<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <match-form>
          <v-btn>
            <v-icon left>mdi-plus-circle-outline</v-icon>
            Match
          </v-btn>
        </match-form>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <v-card-text>
            <v-layout class="text-xs-center" row wrap>
              <v-flex xs12>
                <div class="display-1">{{ match.competition }}</div>
                <div class="subheading">{{ $_formatDate(match.date_played) }}</div>
              </v-flex>
              <v-flex xs12>
                <div class="display-2">{{ match.home }} v {{ match.away }}</div>
                <div class="display-1">
                  {{ match.score }}
                  {{ match.extra_time && !match.penalty_shootout ? '(AET)' : '' }}
                </div>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <div class="headline">Match Details</div>
            <match-actions v-if="match.date_played === team.current_date" :match="match"></match-actions>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm6>
                <match-timeline :match="match"></match-timeline>
              </v-flex>
              <v-flex xs12 sm6>
                <match-lineup :match="match"></match-lineup>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
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
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    layout: 'team',
    components: {
      MatchForm,
      MatchActions,
      MatchLineup,
      MatchTimeline
    },
    middleware: 'authenticated',
    mixins: [ TeamAccessible ],
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
      }
    },
    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('entities/teams/GET', { teamId: params.id, activate: true }),
        store.dispatch('entities/matches/GET', { matchId: params.matchId }),
        store.dispatch('entities/caps/FETCH', { matchId: params.matchId }),
        store.dispatch('entities/bookings/FETCH', { matchId: params.matchId }),
        store.dispatch('entities/goals/FETCH', { matchId: params.matchId }),
        store.dispatch('entities/substitutions/FETCH', { matchId: params.matchId })
      ])
    },
    mounted () {
      this.getPlayers({ teamId: this.team.id })
      this.getSquads({ teamId: this.team.id })
    },
    watch: {
      match (val) {
        !val && this.$router.push({
          name: 'teams-id-matches',
          id: this.team.id
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
