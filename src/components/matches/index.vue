<template>
  <v-slide-x-reverse-transition>
    <v-card>
      <v-card-title primary-title>
        <div class="title">
          // MATCHES
        </div>

        <!-- New Match Form -->
        <match-form :team-id="teamId">
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
          hide-actions
          no-data-text="No Matches Recorded">
          <template slot="items" slot-scope="props">
            <tr @click="props.expanded = !props.expanded">
              <td  class="text-xs-center">{{ props.item.competition }}</td>
              <td class="text-xs-right">{{ props.item.home }}</td>
              <td class="text-xs-center">{{ props.item.score }}</td>
              <td class="text-xs-left">{{ props.item.away }}</td>
              <td class="text-xs-center">{{ props.item.date_played }}</td>
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
            <match-actions :match="props.item"></match-actions>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2" v-if="pages > 1">
          <v-pagination
            v-model="pagination.page"
            :length="pages"
          ></v-pagination>
        </div>
      </v-card-text>
    </v-card>
  </v-slide-x-reverse-transition>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  // import get from 'lodash.get'
  import MatchForm from '@/components/matches/form'
  import MatchActions from '@/components/matches/actions'

  export default {
    data () {
      return {
        teamId: this.$route.params.teamId,
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
      }),
      pages () {
        return this.pagination.rowsPerPage == null || this.pagination.totalItems == null ? 0 : Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
      }
    },
    watch: {
      'team.current_date' (val) {
        this.reloadTable()
      }
    },
    methods: {
      ...mapActions('match', [
        'refresh'
      ]),
      reloadTable () {
        this.loading = true
        this.refresh({ teamId: this.teamId })
          .then((data) => { this.loading = false })
          .catch((error) => { alert(error.message) })
      }
    },
    mounted () {
      this.reloadTable()
    },
    components: {
      'match-form': MatchForm,
      'match-actions': MatchActions
    }
  }
</script>

<style scoped>
  >>> table.v-table tbody td {
    padding: 8px 16px;
    height: auto;
  }
</style>