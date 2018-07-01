<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 sm8 md4>
        <v-flex xs12>
          <v-slide-x-transition>
            <v-card>
              <v-date-picker
                v-model="currentDate"
                color="blue-grey"
                full-width
              ></v-date-picker>
            </v-card>
          </v-slide-x-transition>
        </v-flex>
      </v-flex>
      <v-flex xs12 md8>
        <v-flex xs12>
          <players-panel :team-id="teamId"></players-panel>
        </v-flex>
        <v-flex xs12>
          <matches-panel :team-id="teamId"></matches-panel>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex'
  import PlayersPanel from '@/components/players'
  import MatchesPanel from '@/components/matches'

  export default {
    data: () => ({
      currentDate: null
    }),
    computed: {
      teamId () {
        return this.$route.params.team_id
      }
    },
    watch: {
      currentDate (val, oldVal) {
        oldVal && this.update({ id: this.teamId, current_date: val })
      }
    },
    methods: mapActions('team', [
      'get',
      'update'
    ]),
    components: {
      'players-panel': PlayersPanel,
      'matches-panel': MatchesPanel
    },
    mounted () {
      this.get({ teamId: this.teamId, activate: true })
        .then((data) => { this.currentDate = data.current_date })
    }
  }
</script>
