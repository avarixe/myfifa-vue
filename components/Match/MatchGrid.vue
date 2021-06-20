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
          >
            {{ item.score }}
          </v-btn>
        </template>
        <template #item.played_on="{ item }">
          {{ item.played_on | formatDate }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { addYears, parseISO } from 'date-fns'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'MatchGrid',
    mixins: [
      TeamAccessible
    ],
    data: () => ({
      headers: [
        { text: 'Competition', value: 'competition', align: 'end' },
        { text: 'Home', value: 'home', align: 'end' },
        { text: 'Score', value: 'score', align: 'center', sortable: false },
        { text: 'Away', value: 'away' },
        { text: 'Date Played', value: 'played_on' },
        { text: 'Stage', value: 'stage' }
      ],
      search: '',
      seasonFilter: null,
      competition: null
    }),
    computed: {
      matches () {
        return this.$store.$db().model('Match')
          .query()
          .where('team_id', this.team.id)
          .where(match => !this.competition || match.competition === this.competition)
          .get()
      },
      rows () {
        const teamStart = parseISO(this.team.started_on)

        return this.matches.filter(match => {
          if (this.seasonFilter !== null) {
            const datePlayed = parseISO(match.played_on)
            const seasonStart = addYears(teamStart, this.seasonFilter)
            const seasonEnd = addYears(teamStart, this.seasonFilter + 1)
            return seasonStart <= datePlayed && datePlayed < seasonEnd
          } else {
            return true
          }
        })
      },
      seasons () {
        let seasons = []

        for (let i = 0; i <= this.season; i++) {
          seasons.push({ id: i, label: this.seasonLabel(i) })
        }

        return seasons
      },
      competitions () {
        return this.$store.$db().model('Competition')
          .query()
          .where('team_id', this.team.id)
          .where(comp => !this.seasonFilter || comp.season === this.seasonFilter)
          .get()
          .map(comp => comp.name)
      }
    },
    methods: {
      clearAllFilters () {
        this.seasonFilter = null
        this.competition = null
      }
    }
  }
</script>
