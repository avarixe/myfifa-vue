<template>
  <v-card flat>
    <v-card-title>
      <v-select
        v-model="filters.season"
        :items="filteredItems.map(i => i.season)"
        label="Season"
        clearable
      />

      <v-spacer />

      <v-select
        v-model="filters.competition"
        :items="filteredItems.map(i => i.competition)"
        label="Competition"
        clearable
      />
    </v-card-title>

    <v-card-text>
      <paged-table
        v-model="page"
        :page-count="pageCount"
      >
        <template #table>
          <v-data-table
            :headers="headers"
            :items="filteredItems"
            sort-by="season"
            sort-desc
            must-sort
            :mobile-breakpoint="0"
            hide-default-footer
            :page.sync="page"
            @page-count="pageCount = $event"
          />
        </template>
      </paged-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { Goal } from '@/models'
  import { TeamAccessible } from '@/mixins'
  import { PagedTable } from '@/helpers'

  export default {
    mixins: [
      TeamAccessible
    ],
    components: {
      PagedTable
    },
    props: {
      player: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      filters: {
        season: null,
        competition: null
      },
      headers: [
        {
          text: 'Season',
          value: 'season'
        },
        {
          text: 'Competition',
          value: 'competition'
        },
        {
          text: 'Matches',
          value: 'matches',
          align: 'center'
        },
        {
          text: 'Goals',
          value: 'goals',
          align: 'center'
        },
        {
          text: 'Assists',
          value: 'assists',
          align: 'center'
        },
        {
          text: 'Clean Sheets',
          value: 'cleanSheets',
          align: 'center'
        }
      ],
      page: 1,
      pageCount: 0
    }),
    computed: {
      filteredItems () {
        const season = this.filters.season
        const competition = this.filters.competition
        return this.items.filter(i =>
          (!season || season === i.season) &&
          (!competition || competition === i.competition)
        )
      },
      items () {
        const data = []

        this.$_forEach(this.groupedMatches, (seasonMatches, season) => {
          this.$_forEach(seasonMatches, (matches, competition) => {
            data.push({
              season: this.seasonLabel(season),
              competition,
              matches: matches.length,
              goals: this.numGoals(matches),
              assists: this.numAssists(matches),
              cleanSheets: this.numCleanSheets(matches)
            })
          })
        })

        return data
      },
      groupedMatches () {
        const matches = this.$_groupBy(this.player.matches, 'season')
        this.$_forEach(matches, (seasonMatches, season) => {
          matches[season] = this.$_groupBy(seasonMatches, 'competition')
        })
        return matches
      }
    },
    methods: {
      numGoals (matches) {
        return Goal
          .query()
          .where('match_id', matches.map(m => m.id))
          .where('player_id', this.player.id)
          .count()
      },
      numAssists (matches) {
        return Goal
          .query()
          .where('match_id', matches.map(m => m.id))
          .where('assist_id', this.player.id)
          .count()
      },
      numCleanSheets (matches) {
        return matches.filter(m => {
          return (m.home === this.team.title && m.away_score === 0) ||
            (m.away === this.team.title && m.home_score === 0)
        }).length
      }
    }
  }
</script>
