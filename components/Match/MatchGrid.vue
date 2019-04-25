<template>
  <material-card>
    <template #header>
      <span
        v-text="'Matches'"
        class="title font-weight-light mb-2"
      />

      <match-form>
        <template #default="{ on: dialog }">
          <v-tooltip bottom>
            <template #activator="{ on: tooltip }">
              <v-btn
                v-on="{ ...dialog, ...tooltip }"
                flat
              >
                <v-icon>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </template>
            New Match
          </v-tooltip>
        </template>
      </match-form>
    </template>

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
    <v-data-table
      :headers="headers"
      :items="rows"
      :pagination.sync="pagination"
      :search="search"
      item-key="id"
      no-data-text="No Matches Recorded"
    >
      <template #headerCell="{ header }">
        <span class="subheading font-weight-light text-success text--darken-3">{{ header.text }}</span>
      </template>
      <template #items="{ item }">
        <td>
          <v-tooltip
            right
            color="blue darken-2"
          >
            <template #activator="{ on }">
              <v-btn
                v-on="on"
                :to="matchLink(item)"
                small
                icon
                class="my-0"
              >
                <v-icon
                  small
                  color="blue darken-2"
                >mdi-arrow-right</v-icon>
              </v-btn>
            </template>
            View Match
          </v-tooltip>
        </td>
        <td class="text-xs-center">{{ item.competition }}</td>
        <td class="text-xs-right">{{ item.home }}</td>
        <td :class="resultColor(item.team_result) + '--text text-xs-center'">{{ item.score }}</td>
        <td class="text-xs-left">{{ item.away }}</td>
        <td class="text-xs-center">{{ $_format($_parse(item.date_played), 'MMM DD, YYYY') }}</td>
      </template>
    </v-data-table>

  </material-card>
</template>

<script>
  import {
    Competition,
    Match
  } from '@/models'
  import MatchForm from './MatchForm'
  import MatchRemove from './MatchRemove'
  import MaterialCard from '@/components/theme/Card'
  import { TeamAccessible } from '@/mixins'
  import { addYears } from 'date-fns'

  export default {
    mixins: [
      TeamAccessible
    ],
    components: {
      MatchForm,
      MatchRemove,
      MaterialCard
    },
    data () {
      return {
        pagination: {
          sortBy: 'date_played',
          rowsPerPage: 10,
          descending: true
        },
        headers: [
          { text: '', value: null, sortable: false, width: 40 },
          { text: 'Competition', value: 'competition', align: 'center' },
          { text: 'Home', value: 'home', align: 'right' },
          { text: 'Score', value: 'score', align: 'center', sortable: false },
          { text: 'Away', value: 'away', align: 'left' },
          { text: 'Date Played', value: 'date_played', align: 'center' }
        ],
        search: '',
        seasonFilter: null,
        competition: null
      }
    },
    computed: {
      matches () {
        return Match
          .query()
          .where('team_id', this.team.id)
          .get()
      },
      rows () {
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
            console.log(typeof this.competition)
            if (typeof this.competition === 'string') {
              return match.competition === this.competition
            } else {
              return true
            }
          })
      },
      seasons () {
        let seasons = []

        for (let i = 0; i <= this.season; i++) {
          seasons.push({
            id: i,
            label: this.seasonLabel(i)
          })
        }

        return seasons
      },
      competitions () {
        console.log(typeof this.seasonFilter)
        return Competition
          .query()
          .where('team_id', this.team.id)
          .where(comp => {
            if (typeof this.seasonFilter === 'number') {
              return comp.season === this.seasonFilter
            } else {
              return true
            }
          })
          .get()
          .map(comp => comp.name)
      }
    },
    methods: {
      clearAllFilters () {
        this.seasonFilter = null
        this.competition = null
      },
      viewMatch (match) {
        this.$router.push({
          name: 'matches-id',
          params: { id: match.id }
        })
      },
      resultColor (result) {
        switch (result) {
          case 'win':
            return 'success'
          case 'draw':
            return 'warning'
          case 'loss':
            return 'red'
          default:
            return ''
        }
      },
      matchLink (match) {
        return {
          name: 'teams-teamId-matches-matchId',
          params: {
            teamId: this.team.id,
            matchId: match.id
          }
        }
      }
    }
  }
</script>

<style scoped>
  >>> table.v-table tbody tr td {
    padding: 8px 16px;
    height: auto;
  }
</style>
