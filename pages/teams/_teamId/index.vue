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
          <v-window v-model="curMatch">
            <v-window-item>
              <v-layout class="text-xs-center">
                <v-flex>
                  <match-form>
                    <template #default="{ on }">
                      <v-btn v-on="on">Add Match</v-btn>
                    </template>
                  </match-form>
                </v-flex>
              </v-layout>
            </v-window-item>
            <v-window-item
              v-for="match in latestMatches"
              :key="match.id"
            >
              <v-layout
                class="text-xs-center"
                row
                wrap
              >
                <v-flex xs12>
                  <div class="display-2">{{ match.competition }}</div>
                  <div class="subheading">
                    {{ $_formatDate(match.date_played) }}
                  </div>
                </v-flex>
                <v-layout
                  class="display-1"
                  row
                >
                  <v-flex
                    align-self-center
                    class="font-weight-thin pa-1"
                    style="flex-basis:0"
                  >{{ match.home }}</v-flex>
                  <v-flex
                    align-self-center
                    class="pa-1"
                    shrink
                  >v</v-flex>
                  <v-flex
                    align-self-center
                    class="font-weight-thin pa-1"
                    style="flex-basis:0"
                  >{{ match.away }}</v-flex>
                </v-layout>
                <v-flex xs12>
                  <div class="display-1">
                    {{ match.score }}
                    {{ match.extra_time && !match.penalty_shootout ? '(AET)' : '' }}
                  </div>
                </v-flex>
                <v-flex xs12>
                  <v-btn
                    :to="matchLink(match)"
                    class="blue"
                    nuxt
                    dark
                  >View</v-btn>
                </v-flex>
              </v-layout>
            </v-window-item>
          </v-window>

          <v-card-actions class="justify-space-between">
            <v-btn
              flat
              @click="prevMatch"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>

            <v-item-group
              v-model="curMatch"
              class="text-xs-center"
              mandatory
            >
              <!-- New Match -->
              <v-item>
                <template #default="{ active, toggle }">
                  <v-btn
                    :input-value="active"
                    @click="toggle"
                    round
                    icon
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
              </v-item>

              <v-item
                v-for="match in latestMatches"
                :key="`btn-${match.id}`"
              >
                <template #default="{ active, toggle }">
                  <v-btn
                    :input-value="active"
                    @click="toggle"
                    round
                    icon
                  >
                    <v-icon :color="matchColor(match)">
                      {{ matchIcon(match) }}
                    </v-icon>
                  </v-btn>
                </template>
              </v-item>
            </v-item-group>

            <v-btn
              flat
              @click="nextMatch"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>
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
