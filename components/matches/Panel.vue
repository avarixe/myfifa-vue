<template>
  <v-slide-x-reverse-transition>
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
        ></v-text-field>
      </v-card-title>
      <v-card-text>

        <!-- Match History Grid -->
        <v-data-table
          :headers="headers"
          :items="matches"
          :pagination.sync="pagination"
          :loading="loading"
          :search="search"
          item-key="id"
          no-data-text="No Matches Recorded">
          <template slot="items" slot-scope="props">
            <tr @click="props.expanded = !props.expanded">
              <td class="text-xs-center">{{ props.item.competition }}</td>
              <td class="text-xs-right">{{ props.item.home }}</td>
              <td :class="resultColor(props.item.team_result) + '--text text-xs-center'">{{ props.item.score }}</td>
              <td class="text-xs-left">{{ props.item.away }}</td>
              <td class="text-xs-center">{{ $format($parse(props.item.date_played), 'MMM DD, YYYY') }}</td>
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
            <div class="pa-0">
              <match-actions v-if="props.item.date_played === team.current_date" :match="props.item"></match-actions>
              <match-info :match="props.item" :team="team"></match-info>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-slide-x-reverse-transition>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  // import get from 'lodash.get'
  import MatchForm from '@/components/matches/Form'
  import MatchActions from '@/components/matches/Actions'
  import MatchInfo from '@/components/matches/Info'

  export default {
    data () {
      return {
        pagination: {
          sortBy: 'date_played',
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
      ...mapState('team', {
        team: 'active'
      })
    },
    methods: {
      ...mapActions('match', [
        'refresh'
      ]),
      reloadTable () {
        this.loading = true
        this.refresh({ teamId: this.team.id })
          .then((data) => { this.loading = false })
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
    },
    mounted () {
      this.reloadTable()
    },
    components: {
      'match-form': MatchForm,
      'match-actions': MatchActions,
      'match-info': MatchInfo
    }
  }
</script>

<style scoped>
  >>> table.v-table tbody td {
    padding: 8px 16px;
    height: auto;
  }
</style>
