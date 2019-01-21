<template>
  <material-card>
    <template slot="header">
      <span
        v-text="'Matches'"
        class="title font-weight-light mb-2"
      />

      <match-form>
        <v-tooltip bottom>
          <v-btn slot="activator" flat>
            <v-icon>mdi-plus-circle-outline</v-icon>
          </v-btn>
          New Match
        </v-tooltip>
      </match-form>
    </template>

    <v-flex xs12>
      <!-- Match Search -->
      <v-text-field
        v-model="search"
        label="Search"
        append-icon="mdi-magnify"
        hide-details
      ></v-text-field>
    </v-flex>

    <!-- Match History Grid -->
    <v-data-table
      :headers="headers"
      :items="rows"
      :pagination.sync="pagination"
      :search="search"
      item-key="id"
      no-data-text="No Matches Recorded">
      <template
        slot="headerCell"
        slot-scope="{ header }">
        <span
          class="subheading font-weight-light text-success text--darken-3"
          v-text="header.text"
        />
      </template>
      <template slot="items" slot-scope="props">
        <td>
          <v-tooltip right color="blue darken-2">
            <v-btn
              slot="activator"
              :to="matchLink(props.item)"
              small
              icon>
              <v-icon small color="blue darken-2">mdi-arrow-right</v-icon>
            </v-btn>
            View Match
          </v-tooltip>
        </td>
        <td class="text-xs-center">{{ props.item.competition }}</td>
        <td class="text-xs-right">{{ props.item.home }}</td>
        <td :class="resultColor(props.item.team_result) + '--text text-xs-center'">{{ props.item.score }}</td>
        <td class="text-xs-left">{{ props.item.away }}</td>
        <td class="text-xs-center">{{ $_format($_parse(props.item.date_played), 'MMM DD, YYYY') }}</td>
      </template>
    </v-data-table>

  </material-card>
</template>

<script>
  import { Match } from '@/models'
  import MatchForm from './MatchForm'
  import MatchRemove from './MatchRemove'
  import MaterialCard from '@/components/theme/Card'
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    mixins: [ TeamAccessible ],
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
        search: ''
      }
    },
    computed: {
      rows () {
        return Match
          .query()
          .where('team_id', this.team.id)
          .get()
      }
    },
    methods: {
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
