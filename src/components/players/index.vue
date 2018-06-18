<template>
  <v-slide-x-reverse-transition>
    <v-card>
      <v-card-title primary-title>
        <div class="title">
          // PLAYERS
        </div>
        <player-form title="New Player" :team-id="teamId">
          <v-tooltip bottom>
            <v-btn slot="activator" flat icon>
              <v-icon>person_add</v-icon>
            </v-btn>
            <span>Add Player</span>
          </v-tooltip>
        </player-form>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="table.search"
          label="Search"
          append-icon="search"
        ></v-text-field>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="table.headers"
          :items="players"
          :pagination.sync="table.pagination"
          :loading="table.loading"
          :search="table.search"
          item-key="id"
          hide-actions
          no-data-text="No Players Recorded">
          <template slot="items" slot-scope="props">
            <tr @click="props.expanded = !props.expanded">
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.pos }}</td>
              <td>{{ props.item.ovr }}</td>
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
            <v-card flat>
              <v-card-text>
                <player-form :id="props.item.id" :team-id="teamId" :title="'Edit ' + props.item.name">
                  <v-btn dark color="orange darken-2">Edit</v-btn>
                </player-form>
              </v-card-text>
            </v-card>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2" v-if="pages > 1">
          <v-pagination
            v-model="table.pagination.page"
            :length="pages"
          ></v-pagination>
        </div>
      </v-card-text>
    </v-card>
  </v-slide-x-reverse-transition>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import PlayerForm from '@/components/players/form'

  export default {
    props: ['teamId'],
    data: () => ({
      table: {
        headers: [
          { text: 'Name', value: 'name' },
          { text: 'Position', value: 'pos' },
          { text: 'OVR', value: 'ovr' }
        ],
        pagination: {
          sortBy: 'posIdx'
        },
        loading: false,
        search: ''
      }
    }),
    computed: {
      ...mapState('player', {
        players: 'list'
      }),
      pages () {
        return this.table.pagination.rowsPerPage == null || this.table.pagination.totalItems == null ? 0 : Math.ceil(this.table.pagination.totalItems / this.table.pagination.rowsPerPage)
      }
    },
    methods: {
      ...mapActions('player', [
        'refresh'
      ])
    },
    mounted () {
      this.table.loading = true
      this.refresh({ teamId: this.teamId })
        .then((data) => { this.table.loading = false })
        .catch((error) => { alert(error.message) })
    },
    components: {
      'player-form': PlayerForm
    }
  }
</script>

<style scoped>
  table.table tbody td {
    padding: 5px;
    height: auto;
  }
  .search { width: auto; }
</style>