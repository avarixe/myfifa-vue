<template>
  <v-card flat>
    <v-card-title>
      <v-btn-toggle
        v-model="mode"
        rounded
        mandatory
        class="mx-3"
      >
        <v-btn
          v-for="(opt, i) in modes"
          :key="i"
          text
        >
          <v-icon :color="opt.color">{{ opt.icon }}</v-icon>
        </v-btn>
      </v-btn-toggle>
      <div :class="`subheading ${currentMode.color}--text`">
        {{ currentMode.text }}
      </div>
      <v-spacer />
      <v-text-field
        v-model="search"
        label="Search"
        append-icon="mdi-magnify"
        hide-details
      />
    </v-card-title>

    <!-- Player Information Grid -->
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="rows"
        :loading="loading"
        sort-by="pos"
        :search="search"
        item-key="id"
        :mobile-breakpoint="0"
        no-data-text="No Players Recorded"
      >
        <template #item.name="{ item }">
          <nuxt-link :to="item.link">{{ item.name }}</nuxt-link>
        </template>
        <template #item.ovrChange="{ item }">
          <span :class="ovrColor(item)">
            {{ item.ovrChange > 0 ? '+' : '' }}{{ item.ovrChange }}
          </span>
        </template>
        <template #item.endValue="{ item }">
          {{ item.endValue | formatMoney(team.currency) }}
        </template>
        <template #item.valueChange="{ item }">
          <span :class="valueColor(item)">
            {{ item.valueChange.toFixed(2) }}%
          </span>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { Team, Player } from '@/models'
  import { positions } from '@/models/Player'
  import findLast from 'lodash.findlast'

  export default {
    name: 'SeasonPlayerGrid',
    props: {
      seasonStart: { type: String, required: true },
      seasonEnd: { type: String, required: true },
      seasonData: { type: Object, required: true }
    },
    data: () => ({
      mode: 0,
      modes: [
        { text: 'Growth', color: 'green', icon: 'mdi-trending-up' },
        { text: 'Statistics', color: 'red', icon: 'mdi-numeric' }
      ],
      loading: false,
      filterActive: true,
      search: ''
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
          .whereIdIn(this.seasonData.player_ids.map(id => parseInt(id)))
          .get()
      },
      rows () {
        return this.players.map(player => {
          const firstRecord = findLast(
            this.seasonData.records[player.id],
            record => record.recorded_on <= this.seasonStart
          ) || this.seasonData.records[player.id][0]
          const lastRecord = findLast(
            this.seasonData.records[player.id],
            record => record.recorded_on <= this.seasonEnd
          )

          const startOvr = firstRecord.ovr
          const startValue = firstRecord.value
          const endOvr = lastRecord.ovr
          const endValue = lastRecord.value

          const ovrChange = endOvr - startOvr
          const valueChange = (endValue - startValue) / startValue * 100

          const numGames = this.seasonData.num_games[player.id] || 0
          const numMinutes = this.seasonData.num_minutes[player.id] || 0
          const numGoals = this.seasonData.num_goals[player.id] || 0
          const numAssists = this.seasonData.num_assists[player.id] || 0
          const numCs = this.seasonData.num_cs[player.id] || 0

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
      }
    },
    methods: {
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
