<template>
  <v-slide-x-reverse-transition>
    <v-card>
      <v-card-title primary-title>
        <div class="title">
          // SQUADS
        </div>

        <!-- New Squad Form -->
        <squad-form :team-id="teamId">
          <v-tooltip top>
            <v-btn slot="activator" flat icon>
              <v-icon>add_circle</v-icon>
            </v-btn>
            Add Squad
          </v-tooltip>
        </squad-form>

      </v-card-title>
      <v-card-text>

        <!-- Squads Grid -->
        <v-data-table
          :headers="headers"
          :items="squads"
          :loading="loading"
          item-key="id"
          no-data-text="No Squads Recorded">
          <template slot="items" slot-scope="props">
            <tr @click="props.expanded = !props.expanded">
              <td class="text-xs-center">{{ props.item.name }}</td>
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
            <div class="pa-0">
              <squad-form :initial-squad="props.item" color="orange">
                <v-tooltip bottom color="orange">
                  <v-btn icon slot="activator">
                    <v-icon color="orange">edit</v-icon>
                  </v-btn>
                  Edit
                </v-tooltip>
              </squad-form>
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
  import SquadForm from '@/components/squads/Form'

  export default {
    data () {
      return {
        teamId: this.$route.params.id,
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
      ...mapState('squad', {
        squads: 'list'
      }),
      ...mapState('team', {
        team: 'active'
      })
    },
    methods: {
      ...mapActions('squad', [
        'refresh'
      ]),
      reloadTable () {
        this.loading = true
        this.refresh({ teamId: this.teamId })
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
      'squad-form': SquadForm
    }
  }
</script>

<style scoped>
  >>> table.v-table tbody td {
    padding: 8px 16px;
    height: auto;
  }
</style>
