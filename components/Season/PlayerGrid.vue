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
            multi-sort
            :sort-by="['posIdx', 'numMinutes']"
            :sort-desc="[false, true]"
            :search="search"
            item-key="id"
            hide-default-footer
            no-data-text="No Players Recorded"
            @page-count="pageCount = $event"
          >
            <template #item.name="{ item }">
              <v-btn
                :to="playerLink(item)"
                nuxt
                text
                color="info"
              >{{ item.name }}</v-btn>
            </template>
            <template #item.posIdx="{ item }">
              {{ item.pos }}
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
  import { PagedTable } from '@/helpers'

  @Component({
    components: {
      PagedTable
    }
  })
  export default class SeasonPlayerGrid extends Vue {
    @Prop({ type: [String, Number], required: true }) season
    @Prop({ type: Object, required: true }) seasonData

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
    playerData = {}

    get team () {
      return Team.find(this.$route.params.teamId)
    }

    get currentMode () {
      return this.modes[this.mode]
    }

    get headers () {
      let headers = [
        { text: 'Name', value: 'name' },
        { text: 'Position', value: 'posIdx', align: 'center' },
        { text: 'Age', value: 'age', align: 'center' }
      ]

      switch (this.mode) {
        case 0: // Growth
          return headers.concat([
            { text: 'OVR', value: 'endOvr', align: 'center' },
            { text: 'OVR Change', value: 'ovrChange', align: 'end' },
            { text: 'Value', value: 'endValue', align: 'end' },
            { text: 'Value Change', value: 'valueChange', align: 'end' }
          ])
        case 1: // Statistics
          return headers.concat([
            { text: 'Games Played', value: 'numGames', align: 'end' },
            { text: 'Minutes', value: 'numMinutes', align: 'end' },
            { text: 'Goals', value: 'numGoals', align: 'end' },
            { text: 'Assists', value: 'numAssists', align: 'end' },
            { text: 'Clean Sheets', value: 'numCs', align: 'end' }
          ])
      }
    }

    get rows () {
      return Object.values(this.playerData)
    }

    get seasonStart () {
      let date = this.$_parse(this.team.start_date)
      date = addYears(date, parseInt(this.season))
      return this.$_format(date)
    }

    get seasonEnd () {
      let date = this.$_parse(this.team.start_date)
      date = addYears(date, parseInt(this.season) + 1)
      return this.$_format(date)
    }

    async mounted () {
      await this.$store.dispatch('players/FETCH', {
        teamId: this.team.id
      })

      for (let playerId of this.seasonData.player_ids) {
        const {
          name,
          pos,
          pos_idx: posIdx,
          birth_year: birthYear
        } = Player.find(playerId)
        const playerRecords = this.seasonData.records[playerId]

        const age = parseInt(this.seasonEnd) - birthYear

        const firstRecord = this.firstSeasonRecord(playerRecords)
        const lastRecord = this.lastSeasonRecord(playerRecords)

        const startOvr = firstRecord.ovr
        const startValue = firstRecord.value
        const endOvr = lastRecord.ovr
        const endValue = lastRecord.value

        const ovrChange = endOvr - startOvr
        const valueChange = (endValue - startValue) / startValue * 100

        Vue.set(this.playerData, playerId, {
          id: playerId,
          name,
          pos,
          posIdx,
          age,

          numGames: this.seasonData.num_games[playerId] || 0,
          numSubs: this.seasonData.num_subs[playerId] || 0,
          numMinutes: this.seasonData.num_minutes[playerId] || 0,
          numGoals: this.seasonData.num_goals[playerId] || 0,
          numAssists: this.seasonData.num_assists[playerId] || 0,
          numCs: this.seasonData.num_cs[playerId] || 0,

          endOvr,
          endValue,
          ovrChange,
          valueChange
        })
      }
    }

    closestRecord (records, date) {
      return this.$_orderBy(
        records,
        rec => {
          const date1 = rec.datestamp.replace(/[^0-9]/g, '')
          const date2 = date.replace(/[^0-9]/g, '')
          return Math.abs(date1 - date2)
        }
      )[0]
    }

    firstSeasonRecord (records) {
      return this.closestRecord(records, this.seasonStart)
    }

    lastSeasonRecord (records) {
      return this.closestRecord(records, this.seasonEnd)
    }

    playerLink (player) {
      return {
        name: 'teams-teamId-players-playerId',
        params: {
          teamId: this.$route.params.teamId,
          playerId: player.id
        }
      }
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
