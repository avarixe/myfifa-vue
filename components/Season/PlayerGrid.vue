<template>
  <material-card
    title="Players"
    color="accent"
  >
    <v-card-title>
      <v-btn-toggle
        v-model="mode"
        mandatory
        class="mx-3"
      >
        <v-btn
          v-for="(opt, i) in modes"
          :key="i"
          flat
        >
          <v-icon
            :color="opt.color"
            v-text="opt.icon"
          />
        </v-btn>
      </v-btn-toggle>

      <div
        :class="`subheading ${currentMode.color}--text`"
        v-text="currentMode.text"
      />

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
    <v-data-table
      :headers="headers"
      :items="rows"
      :loading="loading"
      :pagination.sync="pagination"
      :search="search"
      item-key="id"
      must-sort
      no-data-text="No Players Recorded"
    >
      <template
        slot="headerCell"
        slot-scope="{ header }"
      >
        <span
          class="subheading font-weight-light accent--text text--darken-3"
          v-text="header.text"
        />
      </template>
      <template
        slot="items"
        slot-scope="props"
      >
        <player-row
          :season="season"
          :player="props.item"
          :mode="mode"
        />
      </template>
    </v-data-table>

  </material-card>
</template>

<script>
  import { addYears } from 'date-fns'
  import Vue from 'vue'
  import { Team, Player } from '@/models'
  import MaterialCard from '@/components/theme/Card'
  import PlayerRow from './PlayerRow'

  export default {
    components: {
      MaterialCard,
      PlayerRow
    },
    props: {
      season: {
        type: [String, Number],
        required: true
      },
      seasonData: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      mode: 0,
      modes: [
        { text: 'Growth',     color: 'green', icon: 'mdi-trending-up' },
        { text: 'Statistics', color: 'red',   icon: 'mdi-numeric' }
      ],
      loading: false,
      pagination: {
        rowsPerPage: 10,
        sortBy: 'posIdx'
      },
      filterActive: true,
      search: '',
      playerData: {}
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
          { text: 'Name',     value: 'name',    align: 'left' },
          { text: 'Position', value: 'posIdx', align: 'center' },
          { text: 'Age',      value: 'age',     align: 'center' }
        ]

        switch (this.mode) {
          case 0: // Growth
            return headers.concat([
              { text: 'OVR',          value: 'endOvr',      align: 'center' },
              { text: 'OVR Change',   value: 'ovrChange',   align: 'center' },
              { text: 'Value',        value: 'endValue',    align: 'right' },
              { text: 'Value Change', value: 'valueChange', align: 'right' }
            ])
          case 1: // Statistics
            return headers.concat([
              { text: 'Games Played', value: 'numGames',   align: 'right' },
              { text: 'Goals',        value: 'numGoals',   align: 'right' },
              { text: 'Assists',      value: 'numAssists', align: 'right' },
              { text: 'Clean Sheets', value: 'numCs',      align: 'right' }
            ])
        }
      },
      rows () {
        return this.$_orderBy(
          Object.values(this.playerData),
          ['pos_idx', 'numMinutes'],
          ['asc', 'desc']
        )
      },
      seasonStart () {
        let date = this.$_parse(this.team.start_date)
        date = addYears(date, parseInt(this.season))
        return this.$_format(date)
      },
      seasonEnd () {
        let date = this.$_parse(this.team.start_date)
        date = addYears(date, parseInt(this.season) + 1)
        return this.$_format(date)
      }
    },
    async mounted () {
      await this.$store.dispatch('entities/players/FETCH', { teamId: this.team.id })

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
    },
    methods: {
      closestRecord (records, date) {
        return this.$_orderBy(
          records,
          rec => {
            const date1 = rec.datestamp.replace(/[^0-9]/g, '')
            const date2 = date.replace(/[^0-9]/g, '')
            return Math.abs(date1 - date2)
          }
        )[0]
      },
      firstSeasonRecord (records) {
        return this.closestRecord(records, this.seasonStart)
      },
      lastSeasonRecord (records) {
        return this.closestRecord(records, this.seasonEnd)
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
