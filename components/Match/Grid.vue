<template>
  <v-card outlined>
    <v-card-title>
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
    </v-card-title>

    <!-- Match History Grid -->
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
            sort-by="date_played"
            sort-desc
            :search="search"
            item-key="id"
            hide-default-footer
            no-data-text="No Matches Recorded"
            @page-count="pageCount = $event"
          >
            <template #item.score="{ item }">
              <v-btn
                :to="item.link"
                nuxt
                text
                :color="item.resultColor"
              >{{ item.score }}</v-btn>
            </template>
            <template #item.date_played="{ item }">
              {{ $_format($_parse(item.date_played), 'MMM DD, YYYY') }}
            </template>
          </v-data-table>
        </template>
      </paged-table>
    </v-card-text>

  </v-card>
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import { Competition, Match } from '@/models'
  import { PagedTable } from '@/helpers'
  import { TeamAccessible } from '@/mixins'
  import { addYears } from 'date-fns'

  @Component({
    components: {
      PagedTable
    }
  })
  export default class MatchGrid extends mixins(TeamAccessible) {
    headers = [
      { text: 'Competition', value: 'competition', align: 'end' },
      { text: 'Home', value: 'home', align: 'end' },
      { text: 'Score', value: 'score', align: 'center', sortable: false },
      { text: 'Away', value: 'away' },
      { text: 'Date Played', value: 'date_played' }
    ]
    search = ''
    page = 1
    pageCount = 0
    seasonFilter = null
    competition = null

    get matches () {
      return Match
        .query()
        .where('team_id', this.team.id)
        .get()
    }

    get rows () {
      const teamStart = this.$_parse(this.team.start_date)

      return this.matches
        .filter(match => {
          if (typeof this.seasonFilter === 'number') {
            const datePlayed = this.$_parse(match.date_played)
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
  }
</script>
