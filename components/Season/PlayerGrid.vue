<template>
  <v-card>
    <v-card-title primary-title>
      <div class="title">
        // PLAYERS
      </div>

      <v-btn-toggle
        v-model="mode"
        mandatory
        class="mx-3">
        <v-btn
          v-for="(opt, i) in modes"
          :key="i"
          flat>
          <v-icon :color="opt.color">{{ opt.icon }}</v-icon>
        </v-btn>
      </v-btn-toggle>

      <div :class="`subheading ${currentMode.color}--text`">
        {{ currentMode.text }}
      </div>

      <v-spacer></v-spacer>

      <!-- Player Search -->
      <v-text-field
        v-model="search"
        label="Search"
        append-icon="mdi-magnify"
        hide-details
      ></v-text-field>
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
      no-data-text="No Players Recorded">
      <template slot="items" slot-scope="props">
        <player-row
          :season="season"
          :player="props.item"
          :mode="mode"
        ></player-row>
      </template>
    </v-data-table>

  </v-card>
</template>

<script>
  import { addYears } from 'date-fns'
  import Vue from 'vue'
  import { mapState } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import PlayerRow from '@/components/Season/PlayerRow'

  export default {
    components: {
      PlayerRow
    },
    mixins: [ TeamAccessible ],
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
        sortBy: 'pos_idx'
      },
      filterActive: true,
      search: '',
      playerData: {}
    }),
    computed: {
      ...mapState('player', { players: 'list' }),
      currentMode () {
        return this.modes[this.mode]
      },
      headers () {
        let headers = [
          { text: 'Name',     value: 'name',    align: 'left' },
          { text: 'Position', value: 'pos_idx', align: 'center' },
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
      await this.$store.dispatch('player/getAll', { teamId: this.team.id })

      for (let playerId of this.seasonData.player_ids) {
        const playerRecords = this.seasonData.records[playerId]

        const age = parseInt(this.seasonEnd) - this.players[playerId].birth_year

        const firstRecord = this.firstSeasonRecord(playerRecords)
        const lastRecord = this.lastSeasonRecord(playerRecords)

        const startOvr = firstRecord.ovr
        const startValue = firstRecord.value
        const endOvr = lastRecord.ovr
        const endValue = lastRecord.value

        const ovrChange = endOvr - startOvr
        const valueChange = (endValue - startValue) / startValue * 100

        Vue.set(this.playerData, playerId, {
          name: this.players[playerId].name,
          pos: this.players[playerId].pos,
          pos_idx: this.players[playerId].pos_idx,
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
