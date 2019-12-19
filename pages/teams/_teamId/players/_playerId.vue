<template>
  <v-container fluid>
    <v-row>
      <v-container>
        <v-row
          justify="space-around"
          class="text-center"
        >
          <v-col
            cols="6"
            sm="2"
          >
            <div class="display-1">{{ player.pos }}</div>
            <div class="subheading">Position</div>
          </v-col>
          <v-col
            cols="6"
            sm="2"
          >
            <div class="display-1">{{ player.sec_pos | listArray }}</div>
            <div class="subheading">
              <fitty-text
                text="Secondary Position(s)"
                :max-size="16"
              />
            </div>
          </v-col>
          <v-col
            cols="4"
            sm="2"
          >
            <div class="display-1">{{ player.age }}</div>
            <div class="subheading">Age</div>
          </v-col>
          <v-col
            v-if="player.nationality"
            cols="4"
            sm="2"
          >
            <client-only>
              <flag
                :iso="player.flag"
                :title="player.nationality"
                style="font-size: 40px"
              />
            </client-only>
            <div class="subheading">Nationality</div>
          </v-col>
          <v-col
            cols="4"
            sm="2"
          >
            <v-icon
              :color="player.statusColor"
              class="display-1"
            >
              mdi-{{ player.statusIcon }}
            </v-icon>

            <div class="subheading">
              {{ player.status || 'Status' }}
            </div>
          </v-col>
          <v-col cols="12">
            <player-actions :player="player" />
          </v-col>
        </v-row>
      </v-container>

      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-row class="text-center">
              <v-col
                cols="12"
                sm="6"
              >
                <div class="display-1 success--text">{{ player.ovr }}</div>
                <div class="subheading">OVR</div>
              </v-col>

              <v-col
                cols="12"
                sm="6"
              >
                <div class="display-1 primary--text">
                  {{ player.value | formatMoney(team.currency) }}
                </div>
                <div class="subheading">Value</div>
              </v-col>

              <v-col
                cols="6"
                sm="3"
              >
                <div class="display-1 teal--text">
                  {{ numGames || 0 }}
                </div>
                <div class="subheading">Matches</div>
              </v-col>

              <v-col
                cols="6"
                sm="3"
              >
                <div class="display-1 pink--text">
                  {{ numCs || 0 }}
                </div>
                <div class="subheading">Clean Sheets</div>
              </v-col>

              <v-col
                cols="6"
                sm="3"
              >
                <div class="display-1 blue--text">
                  {{ numGoals || 0 }}
                </div>
                <div class="subheading">Goals</div>
              </v-col>

              <v-col
                cols="6"
                sm="3"
              >
                <div class="display-1 orange--text">
                  {{ numAssists || 0 }}
                </div>
                <div class="subheading">Assists</div>
              </v-col>
            </v-row>

            <v-tabs centered>
              <v-tab>Timeline</v-tab>
              <v-tab>Growth</v-tab>

              <!-- Timeline -->
              <v-tab-item>
                <v-card flat>
                  <v-card-text>
                    <player-timeline :player="player" />
                  </v-card-text>
                </v-card>
              </v-tab-item>

              <!-- Growth -->
              <v-tab-item>
                <v-card flat>
                  <v-card-text>
                    <v-row class="text-center">
                      <v-col cols="12">
                        <player-history-chart
                          :player="player"
                          attribute="ovr"
                          label="Overall Rating"
                          color="#4caf50"
                          :min="40"
                          :max="100"
                        />
                      </v-col>

                      <v-col cols="12">
                        <player-history-chart
                          :player="player"
                          attribute="value"
                          label="Value"
                          color="#1976d2"
                          :prefix="team.currency"
                          thousands=","
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mixins, Component, namespace } from 'nuxt-property-decorator'
  import { Player } from '@/models'
  import PlayerActions from '@/components/Player/Actions'
  import PlayerTimeline from '@/components/Player/Timeline'
  import PlayerHistoryChart from '@/components/Charts/PlayerHistoryChart'
  import { FittyText } from '@/helpers'
  import { TeamAccessible } from '@/mixins'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
      PlayerActions,
      PlayerTimeline,
      PlayerHistoryChart,
      FittyText
    },
    transition: 'fade-transition'
  })
  export default class PlayerPage extends mixins(TeamAccessible) {
    @app.Mutation('SET_PAGE') setPage

    get player () {
      return Player
        .query()
        .withAll()
        .find(this.$route.params.playerId)
    }

    async asyncData ({ store, params }) {
      const { data } = await store.dispatch('players/ANALYZE', {
        teamId: params.teamId,
        playerIds: [params.playerId]
      })

      return {
        numGames: data.num_games[params.playerId],
        numCs: data.num_cs[params.playerId],
        numGoals: data.num_goals[params.playerId],
        numAssists: data.num_assists[params.playerId]
      }
    }

    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('players/GET', { playerId: params.playerId }),
        store.dispatch('playerHistories/SEARCH', { teamId: params.teamId }),
        store.dispatch('contracts/FETCH', { playerId: params.playerId }),
        store.dispatch('injuries/FETCH', { playerId: params.playerId }),
        store.dispatch('loans/FETCH', { playerId: params.playerId }),
        store.dispatch('transfers/FETCH', { playerId: params.playerId })
      ])
    }

    beforeMount () {
      this.setPage({
        title: this.player.name,
        overline: this.team.title,
        headline: this.player.name
      })
    }
  }
</script>
