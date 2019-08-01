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

      <!-- Player Search -->
      <v-text-field
        v-model="search"
        label="Search"
        append-icon="mdi-magnify"
        hide-details
      />
    </v-card-title>

    <!-- Player Information Grid -->
    <v-card-text>
      <paged-table
        v-model="page"
        :page-count="pageCount"
      >
        <template #table>
          <v-data-table
            :headers="headers"
            :items="rows"
            :page.sync="page"
            :loading="loading"
            sort-by="pos"
            :search="search"
            item-key="id"
            hide-default-footer
            no-data-text="No Players Recorded"
            @page-count="pageCount = $event"
          >
            <template #item.name="{ item }">
              <v-dialog width="500px">
                <template #activator="{ on }">
                  <v-btn
                    text
                    color="info"
                    v-on="on"
                    v-text="item.name"
                  />
                </template>

                <player-card :player-id="item.id" />
              </v-dialog>
            </template>
            <template #item.ovrChange="{ item }">
              <span :class="ovrColor(item)">
                {{ item.ovrChange > 0 ? '+' : '' }}{{ item.ovrChange }}
              </span>
            </template>
            <template #item.endValue="{ item }">
              {{ $_formatMoney(item.endValue) }}
            </template>
            <template #item.valueChange="{ item }">
              <span :class="valueColor(item)">
                {{ item.valueChange.toFixed(2) }}%
              </span>
            </template>
          </v-data-table>
        </template>
      </paged-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { addYears } from 'date-fns'
  import { Team, Player } from '@/models'
  import { positions } from '@/models/Player'
  import { PagedTable } from '@/helpers'
  import PlayerCard from '@/components/Player/Card'

  @Component({
    components: {
      PagedTable,
      PlayerCard
    }
  })
  export default class SeasonPlayerGrid extends Vue {
    @Prop({ type: [String, Number], required: true }) season

    mode = 0
    modes = [
      { text: 'Growth', color: 'green', icon: 'mdi-trending-up' },
      { text: 'Statistics', color: 'red', icon: 'mdi-numeric' }
    ]
    loading = false
    filterActive = true
    page = 1
    pageCount = 0
    search = ''
    stats = {
      num_games: {},
      num_minutes: {},
      num_goals: {},
      num_assists: {},
      num_cs: {}
    }

    get team () {
      return Team.find(this.$route.params.teamId)
    }

    get currentMode () {
      return this.modes[this.mode]
    }

    get headers () {
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
      }
    }

    get players () {
      return Player
        .query()
        .withAll()
        .whereHas('contracts', query => {
          query.where(contract =>
            this.seasonStart < contract.ended_on &&
            contract.started_on <= this.seasonEnd
          )
        })
        .get()
    }

    get rows () {
      return this.players.map(player => {
        const firstRecord = player.recordAt(this.seasonStart) ||
                            player.histories[0]
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

    get seasonStart () {
      let date = this.$_parse(this.team.started_on)
      date = addYears(date, parseInt(this.season))
      return this.$_format(date)
    }

    get seasonEnd () {
      let date = this.$_parse(this.team.started_on)
      date = addYears(date, parseInt(this.season) + 1)
      return this.$_format(date)
    }

    async mounted () {
      const { data } = await this.$store.dispatch('teams/ANALYZE_SEASON', {
        teamId: this.team.id,
        season: this.season
      })

      this.stats = data
    }

    sortPos (posA, posB) {
      return positions.indexOf(posA) - positions.indexOf(posB)
    }

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
    }

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
</script>

<style scoped>
  >>> table.v-table tbody tr td {
    padding: 8px 16px;
    height: auto;
  }
</style>
