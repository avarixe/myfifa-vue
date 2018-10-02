<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <div class="title">
              // MATCHES
            </div>

            <!-- New Match Form -->
            <match-form>
              <v-tooltip top>
                <v-btn slot="activator" flat icon>
                  <v-icon>add_circle</v-icon>
                </v-btn>
                Record Match
              </v-tooltip>
            </match-form>

            <v-spacer></v-spacer>

            <!-- Match Search -->
            <v-text-field
              v-model="search"
              label="Search"
              append-icon="search"
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-card-text>

            <!-- Match History Grid -->
            <v-data-table
              :headers="headers"
              :items="rows"
              :pagination.sync="pagination"
              :loading="loading"
              :search="search"
              item-key="id"
              no-data-text="No Matches Recorded"
              expand>
              <template slot="items" slot-scope="props">
                <tr @click="viewMatch(props)">
                  <td class="text-xs-center">{{ props.item.competition }}</td>
                  <td class="text-xs-right">{{ props.item.home }}</td>
                  <td :class="resultColor(props.item.team_result) + '--text text-xs-center'">{{ props.item.score }}</td>
                  <td class="text-xs-left">{{ props.item.away }}</td>
                  <td class="text-xs-center">{{ $_format($_parse(props.item.date_played), 'MMM DD, YYYY') }}</td>
                </tr>
              </template>
              <template slot="expand" slot-scope="props">
                <div class="pa-0">
                  <match-actions v-if="props.item.date_played === team.current_date" :match="props.item"></match-actions>
                  <v-layout row wrap class="mx-0">
                    <match-events :match="props.item"></match-events>
                    <match-lineup :match="props.item" v-if="props.item.team_result"></match-lineup>
                  </v-layout>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import MatchForm from '@/components/Match/MatchForm'
  import MatchActions from '@/components/Match/MatchActions'
  import MatchLineup from '@/components/Match/MatchLineup'
  import MatchEvents from '@/components/Match/MatchEvents'
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    components: {
      MatchForm,
      MatchActions,
      MatchLineup,
      MatchEvents
    },
    mixins: [ TeamAccessible ],
    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('team/get', { teamId: params.id, activate: true }),
        store.dispatch('match/getAll', { teamId: params.id }),
        store.dispatch('squad/getAll', { teamId: params.id })
      ])
    },
    data () {
      return {
        pagination: {
          sortBy: 'date_played',
          rowsPerPage: 10,
          descending: true
        },
        headers: [
          { text: 'Competition', value: 'competition', align: 'center' },
          { text: 'Home',        value: 'home',        align: 'right' },
          { text: 'Score',       value: 'score',       align: 'center', sortable: false },
          { text: 'Away',        value: 'away',        align: 'left' },
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
      this.getPlayers({ teamId: this.team.id })
    },
    methods: {
      ...mapActions({
        getPlayers: 'player/getAll',
        getMatches: 'match/getAll',
        getEvents: 'match/getEvents',
        getPerformances: 'performance/getAll'
      }),
      async reloadTable () {
        this.loading = true
        try {
          await this.getMatches({ teamId: this.team.id })
        } catch (e) {
          alert(e.message)
        } finally {
          this.loading = false
        }
      },
      async viewMatch (props) {
        if (props.expanded) {
          props.expanded = false
        } else {
          if (!('events' in props.item)) {
            try {
              this.loading = true
              await this.getPerformances({ matchId: props.item.id })
              await this.getEvents({ matchId: props.item.id })
              this.loading = false
            } catch (e) {
              alert(e.message)
            }
          }

          props.expanded = true
        }
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
