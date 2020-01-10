<template lang="pug">
  v-container(v-if="player" fluid)
    v-row.text-center(justify="space-around")
      v-col(cols=6 sm=2)
        .display-1 {{ player.pos }}
        .subheading Position
      v-col(cols=6 sm=2)
        .display-1 {{ player.sec_pos | listArray }}
        .subheading
          fitty-text(text="Secondary Position(s)" max-size=16)
      v-col(cols=4 sm=2)
        .display-1 {{ player.age }}
        .subheading Age
      v-col(v-if="player.nationality" cols=4 sm=2)
        client-only
          flag(
            :iso="player.flag"
            :title="player.nationality"
            style="font-size: 40px"
          )
        .subheading Nationality
      v-col(cols=4 sm=2)
        v-icon.display-1(:color="player.statusColor")
          | mdi-{{ player.statusIcon }}
        .subheading {{ player.status || 'Status' }}
      v-col(cols=12)
        player-actions(:player="player")
    v-row
      v-col(cols=12)
        v-card
          v-card-text
            v-row.text-center
              v-col(cols=12 sm=6)
                .display-1.success--text {{ player.ovr }}
                .subheading OVR
              v-col(cols=12 sm=6)
                .display-1.primary--text
                  | {{ player.value | formatMoney(team.currency) }}
                .subheading Value
              v-col(cols=6 sm=3)
                .display-1.teal--text {{ numGames || 0 }}
                .subheading Matches
              v-col(cols=6 sm=3)
                .display-1.pink--text {{ numCs || 0 }}
                .subheading Clean Sheets
              v-col(cols=6 sm=3)
                .display-1.blue--text {{ numGoals || 0 }}
                .subheading Goals
              v-col(cols=6 sm=3)
                .display-1.orange--text {{ numAssists || 0 }}
                .subheading Assists
            v-tabs.hidden-lg-and-up(centered)
              v-tab Timeline
              v-tab Growth

              v-tab-item
                player-timeline(:player="player")
              v-tab-item
                player-growth(:player="player")
            v-row.hidden-md-and-down(cols=12)
              v-col(cols=6)
                .title.text-center Timeline
                player-timeline(:player="player" dense)
              v-col(cols=6)
                .title.text-center Growth
                player-growth(:player="player")
</template>

<script>
  import { mapMutations } from 'vuex'
  import { Player } from '@/models'
  import PlayerActions from '@/components/Player/Actions'
  import PlayerGrowth from '@/components/Player/Growth'
  import PlayerTimeline from '@/components/Player/Timeline'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'PlayerPage',
    components: {
      PlayerActions,
      PlayerGrowth,
      PlayerTimeline
    },
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
      player () {
        return Player
          .query()
          .withAll()
          .find(this.$route.params.playerId)
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
    },
    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('players/GET', { playerId: params.playerId }),
        store.dispatch('playerHistories/SEARCH', { teamId: params.teamId }),
        store.dispatch('contracts/FETCH', { playerId: params.playerId }),
        store.dispatch('injuries/FETCH', { playerId: params.playerId }),
        store.dispatch('loans/FETCH', { playerId: params.playerId }),
        store.dispatch('transfers/FETCH', { playerId: params.playerId })
      ])
    },
    mounted () {
      this.setPage({
        title: this.player.name,
        overline: this.team.title,
        headline: this.player.name
      })
    },
    methods: mapMutations('app', {
      setPage: 'SET_PAGE'
    })
  }
</script>
