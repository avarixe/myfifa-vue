<template>
  <v-card>
    <v-toolbar flat>
      <v-select
        v-model="seasonFilter"
        label="Season"
        :items="seasons"
        item-text="label"
        item-value="id"
        clearable
        hide-details
        @click:clear="clearAllFilters"
      />

      <v-spacer />

      <v-select
        v-model="competition"
        label="Competition"
        :items="competitions"
        clearable
        hide-details
      />

      <v-spacer />

      <!-- Match Search -->
      <v-text-field
        v-model="search"
        label="Search"
        append-icon="mdi-magnify"
        hide-details
      />
    </v-toolbar>

    <!-- Match History Grid -->
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="rows"
        sort-by="played_on"
        sort-desc
        :search="search"
        item-key="id"
        no-data-text="No Matches Recorded"
      >
        <template #item.score="{ item }">
          <v-btn
            :to="item.link"
            nuxt
            text
            :color="item.resultColor"
            v-text="item.score"
          />
        </template>
        <template #item.played_on="{ item }">
          {{ datePlayed(item) }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import { addYears } from 'date-fns'
  import { Competition, Match } from '@/models'
  import { TeamAccessible } from '@/mixins'
  import { formatDate } from '@/helpers'

  @Component
  export default class MatchGrid extends mixins(TeamAccessible) {
    headers = [
      { text: 'Competition', value: 'competition', align: 'end' },
      { text: 'Home', value: 'home', align: 'end' },
      { text: 'Score', value: 'score', align: 'center', sortable: false },
      { text: 'Away', value: 'away' },
      { text: 'Date Played', value: 'played_on' }
    ]
    search = ''
    seasonFilter = null
    competition = null

    get matches () {
      return Match
        .query()
        .where('team_id', this.team.id)
        .get()
    }

    get rows () {
      const teamStart = this.$_parse(this.team.started_on)

      return this.matches
        .filter(match => {
          if (typeof this.seasonFilter === 'number') {
            const datePlayed = this.$_parse(match.played_on)
            const seasonStart = addYears(teamStart, this.seasonFilter)
            const seasonEnd = addYears(teamStart, this.seasonFilter + 1)
            return seasonStart <= datePlayed && datePlayed < seasonEnd
          } else {
            return true
          }
        })
        .filter(match => {
          return typeof this.competition === 'string'
            ? match.competition === this.competition
            : true
        })
    }

    get seasons () {
      let seasons = []

      for (let i = 0; i <= this.season; i++) {
        seasons.push({
          id: i,
          label: this.seasonLabel(i)
        })
      }

      return seasons
    }

    get competitions () {
      return Competition
        .query()
        .where('team_id', this.team.id)
        .where(comp => {
          return typeof this.seasonFilter === 'number'
            ? comp.season === this.seasonFilter
            : true
        })
        .get()
        .map(comp => comp.name)
    }

    clearAllFilters () {
      this.seasonFilter = null
      this.competition = null
    }

    datePlayed (match) {
      return formatDate(match.played_on)
    }
  }
</script>
