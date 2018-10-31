<template>
  <v-card>
    <v-card-title primary-title>
      <div class="title">// TEAMS</div>
    </v-card-title>
    <v-card-text>

      <!-- Squads Grid -->
      <v-data-table
        :headers="headers"
        :items="rows"
        :loading="loading"
        item-key="id"
        disable-initial-sort
        no-data-text="No Teams Recorded">
        <template slot="items" slot-scope="props">
          <tr>
            <td class="text-xs-center">{{ props.item.title }}</td>
            <td class="text-xs-center">{{ $_format($_parse(props.item.start_date), 'MMM DD, YYYY') }}</td>
            <td class="text-xs-center">{{ $_format($_parse(props.item.current_date), 'MMM DD, YYYY') }}</td>
            <td class="text-xs-right">
              <team-actions :team="props.item"></team-actions>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import TeamForm from '@/components/Team/TeamForm'
  import TeamActions from '@/components/Team/TeamActions'

  export default {
    components: {
      TeamForm,
      TeamActions
    },
    data () {
      return {
        headers: [
          { text: 'Team Name',    value: 'title',        align: 'center' },
          { text: 'Start Date',   value: 'start_date',   align: 'center' },
          { text: 'Current Date', value: 'current_date', align: 'center' },
          { text: 'Actions',      value: 'actions',      align: 'right',  sortable: false, width: '120px' }
        ],
        loading: false,
        search: ''
      }
    },
    computed: {
      ...mapState('team', {
        teams: 'list'
      }),
      rows () {
        return Object.values(this.teams).sort((a, b) => b.id - a.id)
      }
    },
    mounted () {
      this.reloadTable()
    },
    methods: {
      ...mapActions('team', {
        getTeams: 'getAll'
      }),
      async reloadTable () {
        this.loading = true
        try {
          await this.getTeams()
        } catch (e) {
          alert(e.message)
        } finally {
          this.loading = false
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
  >>> .v-btn-toggle .v-btn {
    opacity: 1;
  }
</style>
