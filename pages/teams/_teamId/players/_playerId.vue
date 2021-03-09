<template>
  <v-container fluid>
    <v-skeleton-loader
      :loading="$fetchState.pending"
      type="article"
    >
      <v-row
        class="text-center"
        justify="space-around"
      >
        <v-col
          cols="6"
          sm="2"
        >
          <div class="text-h4">{{ player.pos }}</div>
          <div class="subheading">Position</div>
        </v-col>
        <v-col
          cols="6"
          sm="2"
        >
          <div class="text-h4">{{ player.sec_pos | listArray }}</div>
          <div class="subheading">
            <fitty-text
              text="Secondary Position(s)"
              max-size="16"
            />
          </div>
        </v-col>
        <v-col
          cols="4"
          sm="2"
        >
          <div class="text-h4">{{ player.age }}</div>
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
              size="xl"
            />
          </client-only>
          <div class="subheading">Nationality</div>
        </v-col>
        <v-col
          cols="4"
          sm="2"
        >
          <v-icon
            class="text-h4"
            :color="player.statusColor"
          >
            mdi-{{ player.statusIcon }}
          </v-icon>
          <div class="subheading">{{ player.status || 'Status' }}</div>
        </v-col>
        <v-col cols="12">
          <player-actions :player="player" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <v-row class="text-center">
                <v-col
                  cols="12"
                  sm="4"
                >
                  <inline-select
                    :item="player"
                    attribute="kit_no"
                    label="Kit No"
                    :options="Array.from({ length: 98 }, (v, k) => k + 1)"
                    dense
                    display-class="text-h4 blue-grey--text"
                    @change="updatePlayerAttribute(player.id, 'kit_no', $event)"
                  />
                  <div class="subheading">Kit No</div>
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                >
                  <inline-select
                    :item="player"
                    attribute="ovr"
                    label="OVR"
                    :options="Array.from({ length: 61 }, (v, k) => k + 40)"
                    dense
                    display-class="text-h4 success--text"
                    @change="updatePlayerAttribute(player.id, 'ovr', $event)"
                  />
                  <div class="subheading">OVR</div>
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                >
                  <inline-field
                    :item="player"
                    attribute="value"
                    label="Value"
                    input-type="money"
                    :display="player.value | formatMoney(team.currency)"
                    display-class="text-h4 primary--text"
                    required
                    @close="updatePlayerAttribute(player.id, 'value', $event)"
                  />
                  <div class="subheading">Value</div>
                </v-col>
                <v-col
                  cols="6"
                  sm="3"
                >
                  <div class="text-h4 teal--text">{{ numGames || 0 }}</div>
                  <div class="subheading">Matches</div>
                </v-col>
                <v-col
                  cols="6"
                  sm="3"
                >
                  <div class="text-h4 pink--text">{{ numCs || 0 }}</div>
                  <div class="subheading">Clean Sheets</div>
                </v-col>
                <v-col
                  cols="6"
                  sm="3"
                >
                  <div class="text-h4 blue--text">{{ numGoals || 0 }}</div>
                  <div class="subheading">Goals</div>
                </v-col>
                <v-col
                  cols="6"
                  sm="3"
                >
                  <div class="text-h4 orange--text">{{ numAssists || 0 }}</div>
                  <div class="subheading">Assists</div>
                </v-col>
              </v-row>
              <v-tabs
                class="hidden-lg-and-up"
                centered
              >
                <v-tab>Timeline</v-tab>
                <v-tab>Growth</v-tab>

                <v-tab-item>
                  <player-timeline :player="player" />
                </v-tab-item>
                <v-tab-item>
                  <player-growth :player="player" />
                </v-tab-item>
              </v-tabs>
              <v-row
                class="hidden-md-and-down"
                cols="12"
              >
                <v-col cols="6">
                  <div class="text-h6 text-center">Timeline</div>
                  <player-timeline
                    :player="player"
                    dense
                  />
                </v-col>
                <v-col cols="6">
                  <div class="text-h6 text-center">Growth</div>
                  <player-growth :player="player" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'PlayerPage',
    mixins: [
      TeamAccessible
    ],
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    head: () => ({
      link: [
        { rel: 'stylesheet', href: '//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css' }
      ]
    }),
    computed: {
      playerId () {
        return this.$route.params.playerId
      },
      player () {
        return this.$store.$db().model('Player')
          .query()
          .withAll()
          .find(this.playerId)
      }
    },
    watch: {
      player () {
        if (!this.player) {
          this.$router.push({
            name: 'teams-teamId-players',
            params: this.$route.params
          })
        }
      }
    },
    async asyncData ({ store, params }) {
      const data = await store.dispatch('players/analyze', {
        teamId: params.teamId,
        playerIds: [params.playerId]
      })

      return {
        numGames: data.num_games[params.playerId],
        numCs: data.num_cs[params.playerId],
        numGoals: data.num_goals[params.playerId],
        numAssists: data.num_assists[params.playerId]
      }
    },
    async fetch () {
      await this.getPlayer({ playerId: this.playerId })

      this.setPage({
        title: this.player.name,
        overline: this.team.title,
        headline: this.player.name
      })
    },
    methods: {
      ...mapMutations({
        setPage: 'app/setPage',
        announce: 'broadcaster/announce'
      }),
      ...mapActions({
        getPlayer: 'players/get',
        updatePlayer: 'players/update'
      }),
      async updatePlayerAttribute (playerId, attribute, value) {
        try {
          await this.updatePlayer({
            id: playerId,
            [attribute]: value
          })
        } catch (e) {
          this.key++
          this.announce({
            message: e.message,
            color: 'red'
          })
        }
      }
    }
  }
</script>
