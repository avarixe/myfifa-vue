<template lang="pug">
  v-card(flat)
    v-card-title
      v-btn-toggle.mx-3(
        v-model="mode"
        rounded
        mandatory
      )
        v-btn(
          v-for="(opt, i) in modes"
          :key="i"
          text
        )
          v-icon(:color="opt.color") {{ opt.icon }}
      .subheading(:class="`${currentMode.color}--text`") {{ currentMode.text }}
      v-spacer
      //- Player Search
      v-text-field(
        v-model="search"
        label="Search"
        append-icon="mdi-magnify"
        hide-details
      )
    //- Player Information Grid
    v-card-text
      v-data-table(
        :headers="headers"
        :items="rows"
        :loading="loading"
        sort-by="pos"
        :search="search"
        item-key="id"
        :mobile-breakpoint="0"
        no-data-text="No Players Recorded"
      )
        template(#item.name="{ item }")
          nuxt-link(:to="item.link") {{ item.name }}
        template(#item.ovrChange="{ item }")
          span(:class="ovrColor(item)")
            | {{ item.ovrChange > 0 ? '+' : '' }}{{ item.ovrChange }}
        template(#item.endValue="{ item }")
          | {{ item.endValue | formatMoney(team.currency) }}
        template(#item.valueChange="{ item }")
          span(:class="valueColor(item)")
            | {{ item.valueChange.toFixed(2) }}%
</template>

<script>
  import { mapActions } from 'vuex'
  import { addYears, format, parseISO } from 'date-fns'
  import { Team, Player } from '@/models'
  import { positions } from '@/models/Player'

  export default {
    name: 'SeasonPlayerGrid',
    props: {
      season: { type: [String, Number], required: true }
    },
    data: () => ({
      mode: 0,
      modes: [
        { text: 'Growth', color: 'green', icon: 'mdi-trending-up' },
        { text: 'Statistics', color: 'red', icon: 'mdi-numeric' }
      ],
      loading: false,
      filterActive: true,
      search: '',
      stats: {
        player_ids: [],
        num_games: {},
        num_minutes: {},
        num_goals: {},
        num_assists: {},
        num_cs: {}
      }
    }),
    computed: {
      team () {
        return Team.find(this.$route.params.teamId)
      },
      currentMode () {
        return this.modes[this.mode]
      },
      headers () {
        let headers = [
          { text: 'Name', value: 'name' },
          { text: 'Position', value: 'pos', align: 'center', sort: this.sortPos },
          { text: 'Age', value: 'age', align: 'center' }
        ]

        switch (this.mode) {
          case 0: // Growth
            return headers.concat([
              { text: 'OVR', value: 'endOvr', align: 'center' },
              { text: 'OVR Change', value: 'ovrChange', align: 'center' },
              { text: 'Value', value: 'endValue', align: 'right' },
              { text: 'Value Change', value: 'valueChange', align: 'right' }
            ])
          case 1: // Statistics
            return headers.concat([
              { text: 'Games Played', value: 'numGames', align: 'right' },
              { text: 'Minutes', value: 'numMinutes', align: 'right' },
              { text: 'Goals', value: 'numGoals', align: 'right' },
              { text: 'Assists', value: 'numAssists', align: 'right' },
              { text: 'Clean Sheets', value: 'numCs', align: 'right' }
            ])
          default:
            return headers
        }
      },
      players () {
        return Player
          .query()
          .with('contracts|histories')
          .whereIdIn(this.stats.player_ids.map(id => parseInt(id)))
          .get()
      },
      rows () {
        return this.players.map(player => {
          const firstRecord = player.recordAt(this.seasonStart) || player.histories[0]
          const lastRecord = player.recordAt(this.seasonEnd)

          const startOvr = firstRecord.ovr
          const startValue = firstRecord.value
          const endOvr = lastRecord.ovr
          const endValue = lastRecord.value

          const ovrChange = endOvr - startOvr
          const valueChange = (endValue - startValue) / startValue * 100

          const numGames = this.stats.num_games[player.id] || 0
          const numMinutes = this.stats.num_minutes[player.id] || 0
          const numGoals = this.stats.num_goals[player.id] || 0
          const numAssists = this.stats.num_assists[player.id] || 0
          const numCs = this.stats.num_cs[player.id] || 0

          return {
            ...player,
            link: player.link,
            age: parseInt(this.seasonEnd) - player.birth_year,
            numGames,
            numMinutes,
            numGoals,
            numAssists,
            numCs,

            endOvr,
            endValue,
            ovrChange,
            valueChange
          }
        })
      },
      seasonStart () {
        let date = parseISO(this.team.started_on)
        date = addYears(date, parseInt(this.season))
        return format(date, 'yyyy-MM-dd')
      },
      seasonEnd () {
        let date = parseISO(this.team.started_on)
        date = addYears(date, parseInt(this.season) + 1)
        return format(date, 'yyyy-MM-dd')
      }
    },
    mounted () {
      this.getSeasonStats()
    },
    methods: {
      ...mapActions('teams', {
        analyzeSeason: 'ANALYZE_SEASON'
      }),
      async getSeasonStats () {
        const { data } = await this.analyzeSeason({
          teamId: this.team.id,
          season: this.season
        })

        this.stats = data
      },
      sortPos (posA, posB) {
        return positions.indexOf(posA) - positions.indexOf(posB)
      },
      ovrColor (player) {
        switch (true) {
          case player.ovrChange > 6:
            return 'green--text text--darken-2'
          case player.ovrChange > 4:
            return 'green--text'
          case player.ovrChange > 2:
            return 'light-green--text text--darken-2'
          case player.ovrChange > 0:
            return 'light-green--text'
          case player.ovrChange < -2:
            return 'red--text'
          case player.ovrChange < 0:
            return 'orange--text'
          default:
            return 'grey--text'
        }
      },
      valueColor (player) {
        switch (true) {
          case player.valueChange > 100:
            return 'green--text text--darken-2'
          case player.valueChange > 50:
            return 'green--text'
          case player.valueChange > 25:
            return 'light-green--text text--darken-2'
          case player.valueChange > 0:
            return 'light-green--text'
          case player.valueChange < -25:
            return 'red--text'
          case player.valueChange < 0:
            return 'orange--text'
          default:
            return 'grey--text'
        }
      }
    }
  }
</script>
