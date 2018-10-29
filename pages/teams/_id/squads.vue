<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <squad-form>
          <v-btn>
            <v-icon left>add</v-icon>
            Squad
          </v-btn>
        </squad-form>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <div class="title">
              // SQUADS
            </div>
          </v-card-title>
          <v-card-text>

            <!-- Squads Grid -->
            <v-data-iterator
              :items="rows"
              :loading="loading"
              content-tag="v-layout"
              row
              wrap
              no-data-text="No Squads Recorded">
              <template slot="item" slot-scope="props">
                <v-flex xs12 md6>
                  <squad-item :squad="props.item"></squad-item>
                </v-flex>
              </template>
            </v-data-iterator>

          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import SquadForm from '@/components/Squad/SquadForm'
  import SquadItem from '@/components/Squad/SquadItem'
  // import SquadActions from '@/components/Squad/SquadActions'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('team/get', { teamId: params.id, activate: true }),
        store.dispatch('squad/getAll', { teamId: params.id })
      ])
    },
    components: {
      SquadForm,
      // SquadActions
      SquadItem
    },
    mixins: [ TeamAccessible ],
    data () {
      return {
        headers: [
          { text: 'Name',    value: 'name',    align: 'center', sortable: false },
          { text: 'Actions', value: 'actions', align: 'right',  sortable: false }
        ],
        loading: false,
        search: ''
      }
    },
    computed: {
      ...mapState('squad', {
        squads: 'list'
      }),
      rows () {
        return Object.values(this.squads)
      }
    },
    mounted () {
      this.getPlayers({ teamId: this.team.id })
    },
    methods: {
      ...mapActions({
        getPlayers: 'player/getAll',
        getSquads: 'squad/getAll'
      }),
      async reloadTable () {
        this.loading = true
        try {
          await this.getSquads({ teamId: this.team.id })
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
  >>> table.v-table tbody tr td {
    padding: 8px 16px;
    height: auto;
  }
</style>
