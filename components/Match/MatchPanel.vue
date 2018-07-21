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
          :items="rows"
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
              <td class="text-xs-center">{{ $_format($_parse(props.item.date_played), 'MMM DD, YYYY') }}</td>
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
            <div class="pa-0">
              <match-actions v-if="props.item.date_played === team.current_date" :match="props.item"></match-actions>
              <v-layout row wrap class="mx-0">
                <match-lineup :match="props.item" v-if="props.item.team_result"></match-lineup>
                <match-events :match="props.item"></match-events>
              </v-layout>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-slide-x-reverse-transition>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import TeamAction from '@/mixins/TeamAction'
  import MatchForm from '@/components/Match/MatchForm'
  import MatchActions from '@/components/Match/MatchActions'
  import MatchLineup from '@/components/Match/MatchLineup'
  import MatchEvents from '@/components/Match/MatchEvents'

  export default {
    components: {
      'match-form': MatchForm,
      'match-actions': MatchActions,
      'match-lineup': MatchLineup,
      'match-events': MatchEvents
    },
    mixins: [ TeamAction ],
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
      rows () {
        return Object.values(this.matches)
      }
    },
    methods: {
      ...mapActions('match', [
        'refresh'
      ]),
      async reloadTable () {
        this.loading = true
        try {
          await this.refresh({ teamId: this.team.id })
        } catch (e) {
          alert(e.message)
        } finally {
          this.loading = false
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
  >>> table.v-table tbody td {
    padding: 8px 16px;
    height: auto;
  }
</style>
