<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">{{ player.name }}</div>
      </v-col>

      <v-row class="text-center">
        <v-col
          cols="6"
          sm="3"
        >
          <div class="display-1">{{ player.pos }}</div>
          <div class="subheading">Position</div>
        </v-col>
        <v-col
          cols="6"
          sm="3"
        >
          <div class="display-1">{{ $_listArray(player.sec_pos) }}</div>
          <div class="subheading">
            <fitty-text
              text="Secondary Position(s)"
              :max-size="16"
            />
          </div>
        </v-col>
        <v-col
          cols="6"
          sm="3"
        >
          <div class="display-1">{{ player.age }}</div>
          <div class="subheading">Age</div>
        </v-col>
        <v-col
          cols="6"
          sm="3"
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
          <record-remove
            :record="player"
            store="players"
            :label="player.name"
            :redirect="linkTo('players')"
          />
        </v-col>
      </v-row>

      <v-col cols="12">
        <v-card outlined>
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
                  {{ $_formatMoney(player.value) }}
                </div>
                <div class="subheading">Value</div>
              </v-col>

              <v-col
                cols="6"
                sm="3"
              >
                <div class="display-1 teal--text">
                  {{ player.matches.length }}
                </div>
                <div class="subheading">Matches</div>
              </v-col>

              <v-col
                cols="6"
                sm="3"
              >
                <div class="display-1 pink--text">
                  {{ player.cleanSheets().length }}
                </div>
                <div class="subheading">Clean Sheets</div>
              </v-col>

              <v-col
                cols="6"
                sm="3"
              >
                <div class="display-1 blue--text">
                  {{ player.goals.length }}
                </div>
                <div class="subheading">Goals</div>
              </v-col>

              <v-col
                cols="6"
                sm="3"
              >
                <div class="display-1 orange--text">
                  {{ player.assists.length }}
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
                    <player-timeline
                      :contracts="player.contracts"
                      :injuries="player.injuries"
                      :loans="player.loans"
                      :transfers="player.transfers"
                    />
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
  import { mixins, Component } from 'nuxt-property-decorator'
  import { Player } from '@/models'
  import PlayerForm from '@/components/Player/Form'
  import PlayerActions from '@/components/Player/Actions'
  import PlayerTimeline from '@/components/Player/Timeline'
  import PlayerHistoryChart from '@/components/Charts/PlayerHistoryChart'
  import { FittyText, RecordRemove } from '@/helpers'
  import { TeamAccessible } from '@/mixins'

  @Component({
    components: {
      PlayerForm,
      PlayerActions,
      PlayerTimeline,
      PlayerHistoryChart,
      FittyText,
      RecordRemove
    },
    transition: 'fade-transition'
  })
  export default class PlayerPage extends mixins(TeamAccessible) {
    layout = () => 'default'
    middleware = () => 'authenticated'

    head () {
      return {
        title: this.player.name
      }
    }

    get player () {
      return Player
        .query()
        .withAll()
        .find(this.$route.params.playerId)
    }

    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
