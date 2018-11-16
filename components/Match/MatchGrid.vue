<template>
  <v-card>
    <v-card-title primary-title>
      <div class="title">
        // MATCHES
      </div>

      <v-spacer></v-spacer>

      <!-- Match Search -->
      <v-text-field
        v-model="search"
        label="Search"
        append-icon="mdi-magnify"
        hide-details
      ></v-text-field>
    </v-card-title>

    <!-- Match History Grid -->
    <v-data-table
      :headers="headers"
      :items="rows"
      :pagination.sync="pagination"
      :loading="loading"
      :search="search"
      item-key="id"
      no-data-text="No Matches Recorded">
      <template slot="items" slot-scope="props">
        <td>
          <v-tooltip bottom color="blue darken-2">
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

  </v-card>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import MatchForm from '@/components/Match/MatchForm'
  import MatchActions from '@/components/Match/MatchActions'
  import MatchLineup from '@/components/Match/MatchLineup'
  import MatchRemove from '@/components/Match/MatchRemove'
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    mixins: [ TeamAccessible ],
    components: {
      MatchForm,
      MatchActions,
      MatchLineup,
      MatchRemove
    },
    data () {
      return {
        pagination: {
          sortBy: 'date_played',
          rowsPerPage: 10,
          descending: true
        },
        headers: [
          { text: '', value: null, sortable: false, width: '40px' },
          { text: 'Competition', value: 'competition', align: 'center' },
          { text: 'Home', value: 'home', align: 'right' },
          { text: 'Score', value: 'score', align: 'center', sortable: false },
          { text: 'Away', value: 'away', align: 'left' },
          { text: 'Date Played', value: 'date_played', align: 'center' }
        ],
        loading: false,
        search: ''
      }
    },
    computed: {
      ...mapState('match', {
        matches: 'list'
      }),
      rows () {
        return Object.values(this.matches)
      }
    },
    mounted () {
      this.reloadGrid()
    },
    methods: {
      ...mapActions({
        getMatches: 'match/getAll',
        getEvents: 'match/getEvents',
        getPerformances: 'performance/getAll'
      }),
      async reloadGrid () {
        this.loading = true
        try {
          await this.getMatches({ teamId: this.team.id })
        } catch (e) {
          alert(e.message)
        } finally {
          this.loading = false
        }
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
            return 'green'
          case 'draw':
            return 'grey'
          case 'loss':
            return 'red'
          default:
            return ''
        }
      },
      matchLink (match) {
        return {
          name: 'teams-id-matches-matchId',
          params: {
            id: this.team.id,
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
