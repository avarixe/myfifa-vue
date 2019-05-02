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
        <match-form />
        <player-form />
      </v-flex>

      <v-flex xs12>
        <material-card :title="team.title">
          <v-layout
            class="text-xs-center"
            row
            wrap
          >
            <v-flex xs12>
              <team-date-picker>
                <template #default="{ on }">
                  <v-btn
                    v-on="on"
                    color="accent"
                    dark
                  >{{ $_format(team.current_date, 'MMM DD, YYYY') }}</v-btn>
                </template>
              </team-date-picker>

              <team-form
                :team-id="team.id"
                color="orange"
              >
                <template #default="{ on }">
                  <v-btn
                    v-on="on"
                    color="orange"
                    dark
                  >Edit</v-btn>
                </template>
              </team-form>

              <team-remove :team="team" />
            </v-flex>
          </v-layout>
        </material-card>
      </v-flex>

      <!-- TODO: Panel for Latest Match -->
      <v-flex md6>

      </v-flex>

      <!-- TODO: Panel for Latest Season -->
      <v-flex md6>
      </v-flex>

      <!-- TODO: Panel for Injured Players -->
      <v-flex md4>
      </v-flex>

      <!-- TODO: Panel for Loaned Players -->
      <v-flex md4>
      </v-flex>

      <!-- TODO: Panel for Expiring Contracts -->
      <v-flex md4>
      </v-flex>

      <!-- TODO: Team Calendar -->
    </v-layout>
  </v-container>
</template>

<script>
  import { Match } from '@/models'
  import MatchForm from '@/components/Match/MatchForm'
  import PlayerForm from '@/components/Player/PlayerForm'
  import TeamDatePicker from '@/components/Team/TeamDatePicker'
  import TeamForm from '@/components/Team/TeamForm'
  import TeamRemove from '@/components/Team/TeamRemove'
  import MaterialCard from '@/components/theme/Card'
  import { TeamAccessible } from '@/mixins'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    components: {
      MatchForm,
      PlayerForm,
      TeamDatePicker,
      TeamForm,
      TeamRemove,
      MaterialCard
    },
    mixins: [
      TeamAccessible
    ],
    head () {
      return {
        title: this.team.title
      }
    },
    data: () => ({
      curMatch: 1
    }),
    computed: {
      latestMatches () {
        return Match
          .query()
          .where('team_id', this.team.id)
          .orderBy('date_played', 'desc')
          .limit(10)
          .get()
        // return []
      }
    },
    methods: {
      matchIcon (match) {
        switch (match.team_result) {
          case 'win':
            return 'mdi-alpha-w'
          case 'draw':
            return 'mdi-alpha-d'
          case 'loss':
            return 'mdi-alpha-l'
          default:
            return ''
        }
      },
      matchColor (match) {
        switch (match.team_result) {
          case 'win':
            return 'success'
          case 'draw':
            return 'warning'
          case 'loss':
            return 'red'
          default:
            return ''
        }
      },
      matchLink (match) {
        return {
          name: 'teams-teamId-matches-matchId',
          params: {
            teamId: this.team.id,
            matchId: match.id
          }
        }
      },
      prevMatch () {
        this.curMatch--
        if (this.curMatch < 0) {
          this.curMatch += this.latestMatches.length + 1
        }
      },
      nextMatch () {
        this.curMatch = (this.curMatch + 1) % (this.latestMatches.length + 1)
      }
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)

      if (this.latestMatches.length === 0) {
        this.curMatch = 0
      }
    }
  }
</script>

<style scoped>
  .v-item--active {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>
