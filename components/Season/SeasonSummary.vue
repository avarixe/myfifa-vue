<template>
  <v-container>
    <v-row
      class="text-center"
      justify="space-around"
      dense
    >
      <v-col
        cols="12"
        sm="6"
      >
        <delta-statistic
          label="Team Value"
          :formatter="x => `${team.currency}${parseInt(x).toLocaleString()}`"
          :start-value="startTeamValue"
          :end-value="endTeamValue"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <delta-statistic
          label="Team OVR"
          :formatter="parseInt"
          average
          :start-value="startTeamOvr"
          :end-value="endTeamOvr"
        />
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col
        cols="4"
        sm="2"
      >
        <div class="text-h4 success--text">{{ numWins }}</div>
        <div class="subheading">Wins</div>
      </v-col>
      <v-col
        cols="4"
        sm="2"
      >
        <div class="text-h4 warning--text">{{ numDraws }}</div>
        <div class="subheading">Draws</div>
      </v-col>
      <v-col
        cols="4"
        sm="2"
      >
        <div class="text-h4 red--text">{{ numLosses }}</div>
        <div class="subheading">Losses</div>
      </v-col>
      <v-col
        cols="6"
        sm="2"
      >
        <div class="text-h4 teal--text">{{ numGoalsFor }}</div>
        <div class="subheading">Goals For</div>
      </v-col>
      <v-col
        cols="6"
        sm="2"
      >
        <div class="text-h4 pink--text">{{ numGoalsAgainst }}</div>
        <div class="subheading">Goals Against</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import findLast from 'lodash.findlast'

  function calcTotal (records, attribute) {
    return records.reduce((total, record) => total + record[attribute], 0)
  }

  function calcAverage (records, attribute) {
    return calcTotal(records, attribute) / records.length
  }

  export default {
    name: 'SeasonSummary',
    props: {
      seasonStart: { type: String, required: true },
      seasonEnd: { type: String, required: true },
      seasonData: { type: Object, required: true }
    },
    computed: {
      team () {
        return this.$store.$db().model('Team').find(this.$route.params.teamId)
      },
      recordsAtStart () {
        let records = []
        for (const playerId in this.seasonData.records) {
          const record = findLast(
            this.seasonData.records[playerId],
            record => record.recorded_on <= this.seasonStart
          )
          record && records.push(record)
        }
        return records
      },
      recordsAtEnd () {
        let records = []
        for (const playerId in this.seasonData.records) {
          if (this.seasonData.expired_players.indexOf(parseInt(playerId)) < 0) {
            const record = findLast(
              this.seasonData.records[playerId],
              record => record.recorded_on <= this.seasonEnd
            )
            record && records.push(record)
          }
        }
        return records
      },
      startTeamValue () {
        return calcTotal(this.recordsAtStart, 'value')
      },
      endTeamValue () {
        return calcTotal(this.recordsAtEnd, 'value')
      },
      startTeamOvr () {
        return calcAverage(this.recordsAtStart, 'ovr')
      },
      endTeamOvr () {
        return calcAverage(this.recordsAtEnd, 'ovr')
      },
      numWins () {
        return calcTotal(Object.values(this.seasonData.results), 'wins')
      },
      numDraws () {
        return calcTotal(Object.values(this.seasonData.results), 'draws')
      },
      numLosses () {
        return calcTotal(Object.values(this.seasonData.results), 'losses')
      },
      numGoalsFor () {
        return calcTotal(Object.values(this.seasonData.results), 'gf')
      },
      numGoalsAgainst () {
        return calcTotal(Object.values(this.seasonData.results), 'ga')
      }
    }
  }
</script>
