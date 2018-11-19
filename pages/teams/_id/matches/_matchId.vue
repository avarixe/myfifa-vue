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
                <div class="display-1">{{ match.score }}</div>
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
  import { mapState, mapActions } from 'vuex'
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
      ...mapState('player', { players: 'list' }),
      ...mapState('match', { matches: 'list' }),
      match () {
        return this.matches[this.$route.params.matchId]
      }
    },
    async fetch ({ store, params }) {
      await Promise.all([
        (async () => {
          store.state.team.currentId !== params.id &&
          await store.dispatch('team/get', { teamId: params.id, activate: true })
        })(),
        (async () => {
          !(params.matchId in store.state.match.list) &&
          await store.dispatch('match/get', { matchId: params.matchId })
        })(),
        store.dispatch('cap/getAll', { matchId: params.matchId }),
        store.dispatch('match/getEvents', { matchId: params.matchId })
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
        getPlayers: 'player/getAll',
        getSquads: 'squad/getAll'
      })
    }
  }
</script>
