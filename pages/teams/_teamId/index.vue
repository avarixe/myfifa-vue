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
        <material-card :title="team.title">
          <v-layout
            class="text-xs-center"
            row
            wrap
          >
            <v-flex xs12>
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

      <!-- Latest Matches -->
      <v-flex>
        <material-card
          title="Latest Matches"
          color="blue"
        >
          <v-timeline dense>
            <v-timeline-item
              icon="mdi-plus"
              fill-dot
              color="blue"
            >
              <match-form>
                <template #default="{ on }">
                  <v-btn
                    v-on="on"
                    large
                    flat
                  >Play a Match</v-btn>
                </template>
              </match-form>
            </v-timeline-item>

            <v-timeline-item
              v-for="match in latestMatches"
              :key="match.id"
              :icon="matchIcon(match)"
              :color="matchColor(match)"
              fill-dot
            >
              <table>
                <tr>
                  <td>
                    <div class="title font-weight-light">
                      <small>{{ match.home }}</small>
                      <strong>{{ match.score }}</strong>
                      <small>{{ match.away}}</small>
                    </div>
                    <div class="title font-weight-light">
                      {{ match.competition }}
                      <small class="caption">
                        {{ $_format(match.date_played, 'MMM DD, YYYY') }}
                      </small>
                    </div>
                  </td>
                  <td>
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <v-btn
                          v-on="on"
                          :to="matchLink(match)"
                          nuxt
                          icon
                        >
                          <v-icon color="blue">mdi-arrow-right</v-icon>
                        </v-btn>
                      </template>
                      View Match
                    </v-tooltip>
                  </td>
                </tr>
              </table>
            </v-timeline-item>
          </v-timeline>
        </material-card>
      </v-flex>
      <!-- TODO: Injured Players -->
    </v-layout>
  </v-container>
</template>

<script>
  import { Match } from '@/models'
  import MatchForm from '@/components/Match/MatchForm'
  import TeamForm from '@/components/Team/TeamForm'
  import TeamRemove from '@/components/Team/TeamRemove'
  import MaterialCard from '@/components/theme/Card'
  import { TeamAccessible } from '@/mixins'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    components: {
      MatchForm,
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
      latestMatch: 1
    }),
    computed: {
      latestMatches () {
        return Match
          .query()
          .where('team_id', this.team.id)
          .orderBy('date_played', 'desc')
          .limit(5)
          .get()
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
      }
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
