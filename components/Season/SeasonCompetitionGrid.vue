<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    :items-per-page="-1"
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
      >
        {{ item.name }}
      </v-btn>
    </template>
    <template #item.status="{ item }">
      <v-icon
        :color="item.statusColor"
        small
      >
        {{ item.statusIcon }}
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    name: 'SeasonCompetitionGrid',
    props: {
      season: { type: Number, required: true },
      results: { type: Object, required: true }
    },
    data: () => ({
      headers: [
        { text: 'Competition', value: 'name' },
        { text: '', value: 'status' },
        { text: 'GP', value: 'gp', align: 'center' },
        { text: 'W', value: 'wins', align: 'center' },
        { text: 'D', value: 'draws', align: 'center' },
        { text: 'L', value: 'losses', align: 'center' },
        { text: 'GF', value: 'gf', align: 'center' },
        { text: 'GA', value: 'ga', align: 'center' },
        { text: 'GD', value: 'gd', align: 'center' }
      ]
    }),
    computed: {
      team () {
        return this.$store.$db().model('Team').find(this.$route.params.teamId)
      },
      competitions () {
        return this.$store.$db().model('Competition')
          .query()
          .with('team')
          .where('team_id', this.team.id)
          .where('season', this.season)
          .get()
      },
      rows () {
        return this.competitions.map(competition => {
          const {
            wins = 0,
            draws = 0,
            losses = 0,
            gf = 0,
            ga = 0
          } = this.results[competition.name] || {}

          return {
            name: competition.name,
            link: competition.link,
            statusIcon: competition.statusIcon,
            statusColor: competition.statusColor,
            gp: wins + draws + losses,
            wins,
            draws,
            losses,
            gf,
            ga,
            gd: gf - ga
          }
        })
      }
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
