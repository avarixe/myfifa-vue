<script>
  import { toRefs, computed, useStore } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'

  export default {
    name: 'SeasonCompetitionGrid',
    props: {
      season: { type: Number, required: true },
      competitionStats: { type: Array, required: true }
    },
    setup (props) {
      const { team } = useTeam()
      const { season, competitionStats } = toRefs(props)

      const store = useStore()
      const competitions = computed(() =>
        store.$db().model('Competition')
          .query()
          .with('team')
          .where('teamId', team.value.id)
          .where('season', season.value)
          .get()
      )

      const results = computed(() =>
        competitionStats.value.reduce((results, stats) => {
          results[stats.competition] = stats
          return results
        }, {})
      )

      const rows = computed(() => competitions.value.map(competition => {
        const {
          wins = 0,
          draws = 0,
          losses = 0,
          goalsFor = 0,
          goalsAgainst = 0
        } = results.value[competition.name] || {}

        return {
          name: competition.name,
          link: competition.link,
          statusIcon: competition.statusIcon,
          statusColor: competition.statusColor,
          matchesPlayed: wins + draws + losses,
          wins,
          draws,
          losses,
          goalsFor,
          goalsAgainst,
          goalDifference: goalsFor - goalsAgainst
        }
      }))

      return {
        rows,
        headers: [
          { text: 'Competition', value: 'name', class: 'stick-left', cellClass: 'stick-left' },
          { text: 'Status', value: 'status', align: 'center' },
          { text: 'GP', value: 'matchesPlayed', align: 'center' },
          { text: 'W', value: 'wins', align: 'center' },
          { text: 'D', value: 'draws', align: 'center' },
          { text: 'L', value: 'losses', align: 'center' },
          { text: 'GF', value: 'goalsFor', align: 'center' },
          { text: 'GA', value: 'goalsAgainst', align: 'center' },
          { text: 'GD', value: 'goalDifference', align: 'center' }
        ]
      }
    }
  }
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    :items-per-page="-1"
    :mobile-breakpoint="0"
    disable-sort
    hide-default-footer
    class="mt-2"
  >
    <template #item="{ item }">
      <tr>
        <td class="stick-left">
          <v-btn
            :to="item.link"
            nuxt
            small
            text
            color="primary"
            class="text-capitalize"
          >
            {{ item.name }}
          </v-btn>
        </td>
        <td class="text-center">
          <v-icon
            :color="item.statusColor"
            small
          >
            {{ item.statusIcon }}
          </v-icon>
        </td>
        <td class="text-center">{{ item.matchesPlayed }}</td>
        <td class="text-center">{{ item.wins }}</td>
        <td class="text-center">{{ item.draws }}</td>
        <td class="text-center">{{ item.losses }}</td>
        <td class="text-center">{{ item.goalsFor }}</td>
        <td class="text-center">{{ item.goalsAgainst }}</td>
        <td class="text-center">{{ item.goalDifference }}</td>
      </tr>
    </template>
  </v-data-table>
</template>
