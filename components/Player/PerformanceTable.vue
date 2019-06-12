<template>
  <v-data-table
    :headers="headers"
    :items="items"
  >
    <template #item.season="{ item }">
      {{ seasonLabel(item.season) }}
    </template>
  </v-data-table>
</template>

<script>
  import { Goal } from '@/models'
  import { TeamAccessible } from '@/mixins'

  export default {
    mixins: [
      TeamAccessible
    ],
    props: {
      player: {
        type: Object,
        required: true
      }
    },
    data: () => ({
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
      ]
    }),
    computed: {
      items () {
        const data = []

        this.$_forEach(this.groupedMatches, (seasonMatches, season) => {
          this.$_forEach(seasonMatches, (matches, competition) => {
            data.push({
              season,
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
        return Goal.query()
          .where('match_id', matches.map(m => m.id))
          .where('player_id', this.player.id)
          .count()
      },
      numAssists (matches) {
        return Goal.query()
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
