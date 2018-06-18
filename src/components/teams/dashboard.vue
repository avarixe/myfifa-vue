<template>
  <v-container fluid grid-list-lg>
    <v-layout
      v-if="'id' in team"
      row
      wrap>
      <v-flex xs12 sm8 md4>
        <v-flex xs12>
          <v-card>
            <v-card-text>
              <v-date-picker
                v-model="team.current_date"
                @input="update(team)"
                color="blue-grey"
                full-width
              ></v-date-picker>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-flex>
      <v-flex xs12 md8>
        <v-flex xs12>
          <players-panel :team-id="team.id"></players-panel>
        </v-flex>
        <v-flex xs12>
          <matches-panel :team-id="team.id"></matches-panel>
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
      team: {}
    }),
    computed: {
      teamId () {
        return this.$route.params.team_id
      }
    },
    methods: {
      ...mapActions({
        get: 'team/get',
        update: 'team/update'
      })
    },
    components: {
      'players-panel': PlayersPanel,
      'matches-panel': MatchesPanel
    },
    mounted () {
      this.get({ teamId: this.teamId, activate: true })
        .then((data) => { this.team = data })
    }
  }
</script>
