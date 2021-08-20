<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="matches"
        sort-by="playedOn"
        sort-desc
        item-key="id"
        no-data-text="No Matches Recorded"
        :mobile-breakpoint="0"
      >
        <template #top>
          <match-filters :filters.sync="filters" />
        </template>
        <template #item="{ item }">
          <tr>
            <td class="text-center">
              <div>{{ item.home }} v {{ item.away }}</div>
              <div :class="`${item.resultColor}--text`">{{ item.score }}</div>
            </td>
            <td class="text-center">
              <div>{{ item.competition }}</div>
              <i v-if="item.stage">{{ item.stage }}</i>
            </td>
            <td>{{ item.playedOn | formatDate }}</td>
            <td class="stick-right">
              <v-btn
                :to="item.link"
                nuxt
                block
                color="info"
              >
                <v-icon>mdi-play</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'MatchGrid',
    data: () => ({
      headers: [
        { text: 'Match', value: 'score', align: 'center', sortable: false, width: 250 },
        { text: 'Competition', value: 'competition', align: 'center', sortable: false, width: 250 },
        { text: 'Date Played', value: 'playedOn', width: 120 },
        { text: 'Link', value: 'link', align: 'center', class: 'stick-right', sortable: false, width: 40 }
      ],
      filters: {
        Season: null,
        Competition: null,
        Stage: null,
        Team: null,
        Result: null
      }
    }),
    computed: {
      matches () {
        return this.$store.$db().model('Match')
          .query()
          .where('teamId', parseInt(this.$route.params.teamId))
          .where(match => {
            for (const filter in this.filters) {
              if (!this.matchPassesFilter(match, filter)) {
                return false
              }
            }

            return true
          })
          .get()
      }
    },
    methods: {
      matchPassesFilter (match, filter) {
        const filterValue = this.filters[filter]

        if (filterValue === null) {
          return true
        }

        switch (filter) {
          case 'Season':
            return filterValue === match.season
          case 'Competition':
            return filterValue === match.competition
          case 'Stage':
            return match.stage &&
              match.stage.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0
          case 'Team':
            return match.home.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0 ||
              match.away.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0
          case 'Result':
            return filterValue.toLowerCase() === match.teamResult
        }
      }
    }
  }
</script>
