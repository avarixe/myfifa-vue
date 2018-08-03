<template>
  <v-card>
    <v-card-title primary-title>
      <div class="title">
        // SQUADS
      </div>

      <!-- New Squad Form -->
      <squad-form :team-id="team.id">
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
        :items="rows"
        :loading="loading"
        item-key="id"
        disable-initial-sort
        no-data-text="No Squads Recorded">
        <template slot="items" slot-scope="props">
          <tr @click="props.expanded = !props.expanded">
            <td class="text-xs-center">{{ props.item.name }}</td>
            <td class="text-xs-right">
              <squad-actions :squad="props.item"></squad-actions>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  // import get from 'lodash.get'
  import TeamAction from '@/mixins/TeamAction'
  import SquadForm from '@/components/Squad/SquadForm'
  import SquadActions from '@/components/Squad/SquadActions'

  export default {
    components: {
      'squad-form': SquadForm,
      'squad-actions': SquadActions
    },
    mixins: [ TeamAction ],
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
      this.reloadTable()
    },
    methods: {
      ...mapActions('squad', [
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
