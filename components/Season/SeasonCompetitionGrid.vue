<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    :items-per-page="-1"
    :loading="loading"
    :mobile-breakpoint="0"
    disable-sort
    hide-default-footer
  >
    <template #item.name="{ item }">
      <v-btn
        :to="item.link"
        nuxt
        small
        text
        color="primary"
        class="text-capitalize"
        v-text="item.name"
      />
    </template>
    <template #item.status="{ item }">
      <v-icon
        :color="item.statusColor"
        small
        v-text="item.statusIcon"
      />
    </template>
  </v-data-table>
</template>

<script>
  import { gql } from 'nuxt-graphql-request'
  import { competitionStatsFragment } from '@/fragments'

  export default {
    name: 'SeasonCompetitionGrid',
    props: {
      season: { type: Number, required: true }
    },
    data: () => ({
      headers: [
        { text: 'Competition', value: 'name' },
        { text: '', value: 'status' },
        { text: 'GP', value: 'matchesPlayed', align: 'center' },
        { text: 'W', value: 'wins', align: 'center' },
        { text: 'D', value: 'draws', align: 'center' },
        { text: 'L', value: 'losses', align: 'center' },
        { text: 'GF', value: 'goalsFor', align: 'center' },
        { text: 'GA', value: 'goalsAgainst', align: 'center' },
        { text: 'GD', value: 'goalDifference', align: 'center' }
      ],
      loading: true,
      results: []
    }),
    computed: {
      team () {
        return this.$store.$db().model('Team').find(this.$route.params.teamId)
      },
      competitions () {
        return this.$store.$db().model('Competition')
          .query()
          .with('team')
          .where('teamId', this.team.id)
          .where('season', this.season)
          .get()
      },
      rows () {
        if (this.loading) {
          return []
        } else {
          return this.competitions.map(competition => {
            const {
              wins = 0,
              draws = 0,
              losses = 0,
              goalsFor = 0,
              goalsAgainst = 0
            } = this.results[competition.name] || {}

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
          })
        }
      }
    },
    async mounted () {
      const query = gql`
        query fetchCompetitionStats($id: ID!, $season: Int) {
          team(id: $id) {
            competitionStats(season: $season) {
              ...CompetitionStatsData
            }
          }
        }
        ${competitionStatsFragment}
      `

      const { team: { competitionStats } } =
        await this.$graphql.default.request(query, {
          id: this.team.id,
          season: this.season
        })

      this.results = competitionStats.reduce((results, stats) => {
        results[stats.competition] = stats
        return results
      }, {})

      this.loading = false
    },
    methods: {
      competitionLink (competition) {
        const record = this.$store.$db().model('Competition')
          .query()
          .where('season', this.season)
          .where('name', competition)
          .get()

        if (record.length > 0) {
          return {
            name: 'teams-teamId-competitions-competitionId',
            params: {
              teamId: this.$route.params.teamId,
              competitionId: record[0].id
            }
          }
        }
      }
    }
  }
</script>
