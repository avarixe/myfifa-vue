<template>
  <v-container>
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
        <div class="text-h4">{{ player.secPos | listArray }}</div>
        <div class="subheading">Secondary Position(s)</div>
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
        <flag
          :iso="player.flag"
          :title="player.nationality"
          size="xl"
        />
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
                cols="6"
                sm="4"
              >
                <inline-select
                  :item="player"
                  attribute="kitNo"
                  label="Kit No"
                  :options="Array.from({ length: 98 }, (v, k) => k + 1)"
                  dense
                  display-class="text-h4 blue-grey--text"
                  @change="updatePlayerAttribute(player.id, 'kitNo', $event)"
                />
                <div class="subheading">Kit No</div>
              </v-col>
              <v-col
                cols="6"
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
                <div class="text-h4 teal--text">{{ numMatches || 0 }}</div>
                <div class="subheading">Matches</div>
              </v-col>
              <v-col
                cols="6"
                sm="3"
              >
                <div class="text-h4 pink--text">{{ numCleanSheets || 0 }}</div>
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
  </v-container>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { TeamAccessible } from '@/mixins'
  import {
    contractFragment,
    transferFragment,
    loanFragment,
    injuryFragment,
    playerFragment,
    playerHistoryFragment,
    playerPerformanceStatsFragment
  } from '@/fragments'

  export default {
    name: 'PlayerPage',
    mixins: [
      TeamAccessible
    ],
    async asyncData ({ store, route, $graphql, redirect }) {
      const { teamId, playerId } = route.query

      if (teamId && playerId) {
        const query = gql`
          query fetchPlayerPage($teamId: ID!, $playerId: ID!) {
            player(id: $playerId) {
              ...PlayerData
              contracts { ...ContractData }
              transfers { ...TransferData }
              loans { ...LoanData }
              injuries { ...InjuryData }
              histories { ...PlayerHistoryData }
            }
            team(id: $teamId) {
              playerPerformanceStats(playerIds: [$playerId]) {
                ...PlayerPerformanceStatsData
              }
            }
          }
          ${playerFragment}
          ${contractFragment}
          ${transferFragment}
          ${loanFragment}
          ${injuryFragment}
          ${playerHistoryFragment}
          ${playerPerformanceStatsFragment}
        `

        const { player, team: { playerPerformanceStats } } =
          await $graphql.default.request(query, {
            teamId: parseInt(teamId),
            playerId: parseInt(playerId)
          })

        await store.$db().model('Player').insert({ data: player })

        const data = {
          numMatches: 0,
          numCleanSheets: 0,
          numGoals: 0,
          numAssists: 0
        }

        playerPerformanceStats.forEach(stats => {
          for (const stat in data) {
            data[stat] += stats[stat]
          }
        })

        store.commit('app/setPage', {
          title: player.name,
          headline: player.name
        })

        return data
      } else if (teamId) {
        redirect({ name: 'team', query: { teamId } })
      } else {
        redirect('/')
      }
    },
    head: () => ({
      link: [
        { rel: 'stylesheet', href: '//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css' }
      ]
    }),
    computed: {
      playerId () {
        return parseInt(this.$route.query.playerId)
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
            name: 'players',
            query: this.$route.query
          })
        }
      }
    },
    watchQuery: ['playerId'],
    methods: {
      ...mapMutations('broadcaster', [
        'announce'
      ]),
      ...mapActions('players', {
        updatePlayer: 'update'
      }),
      async updatePlayerAttribute (playerId, attribute, value) {
        try {
          await this.updatePlayer({
            id: playerId,
            attributes: { [attribute]: value }
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
