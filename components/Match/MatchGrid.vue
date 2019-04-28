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
        <span class="subheading font-weight-light text-success text--darken-3">
          {{ header.text }}
        </span>
      </template>
      <template #items="{ item: match }">
        <v-tooltip bottom>
          <template #activator="{ on }">
            <tr
              v-on="on"
              @click="$router.push(matchLink(match))"
            >
              <td class="text-xs-center">{{ match.competition }}</td>
              <td class="text-xs-right">{{ match.home }}</td>
              <td :class="`${resultColor(match.team_result)} text-xs-center`">
                {{ match.score }}
              </td>
              <td class="text-xs-left">{{ match.away }}</td>
              <td class="text-xs-center">
                {{ $_format($_parse(match.date_played), 'MMM DD, YYYY') }}
              </td>
            </tr>
          </template>
          Click to View Match: <br>
          <i>{{ match.home }} v {{ match.away }}</i>
        </v-tooltip>
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
          {
            text: 'Competition',
            value: 'competition',
            align: 'center'
          },
          {
            text: 'Home',
            value: 'home',
            align: 'right'
          },
          {
            text: 'Score',
            value: 'score',
            align: 'center',
            sortable: false
          },
          {
            text: 'Away',
            value: 'away',
            align: 'left'
          },
          {
            text: 'Date Played',
            value: 'date_played',
            align: 'center'
          }
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
            return typeof this.competition === 'string'
              ? match.competition === this.competition
              : true
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
            return 'success--text'
          case 'draw':
            return 'warning--text'
          case 'loss':
            return 'red--text'
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
