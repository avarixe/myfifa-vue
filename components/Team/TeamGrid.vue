<template>
  <v-card flat>
    <v-data-table
      :headers="headers"
      :items="rows"
      :loading="loading"
      item-key="id"
      no-data-text="No Teams Recorded"
    >
      <template #item="{ item: team }">
        <v-tooltip bottom>
          <template #activator="{ on }">
            <tr
              v-on="on"
              @click="$router.push(teamLink(team))"
            >
              <td class="text-xs-center">{{ team.title }}</td>
              <td class="text-xs-center">
                {{ $_format($_parse(team.start_date), 'MMM DD, YYYY') }}
              </td>
              <td class="text-xs-center">
                {{ $_format($_parse(team.current_date), 'MMM DD, YYYY') }}
              </td>
            </tr>
          </template>
          Click to Manage Team: <br>
          <i>{{ team.title }}</i>
        </v-tooltip>
      </template>
    </v-data-table>

  </v-card>
</template>

<script>
  import { Team } from '@/models'
  import { mapActions } from 'vuex'
  import MaterialCard from '@/components/theme/Card'

  export default {
    components: {
      MaterialCard
    },
    data () {
      return {
        headers: [
          {
            text: 'Team Name',
            value: 'title',
            align: 'center'
          },
          {
            text: 'Start Date',
            value: 'start_date',
            align: 'center'
          },
          {
            text: 'Current Date',
            value: 'current_date',
            align: 'center'
          }
        ],
        loading: false,
        search: ''
      }
    },
    computed: {
      teams () {
        return Team.all()
      },
      rows () {
        return this.$_orderBy(this.teams, ['id'], ['desc'])
      }
    },
    mounted () {
      this.reloadTable()
    },
    methods: {
      ...mapActions('teams', {
        fetch: 'FETCH'
      }),
      async reloadTable () {
        this.loading = true
        try {
          await this.fetch()
        } catch (e) {
          alert(e.message)
        } finally {
          this.loading = false
        }
      },
      teamLink (team) {
        return {
          name: 'teams-teamId',
          params: { teamId: team.id }
        }
      }
    }
  }
</script>

<style scoped>
  .v-card, .v-data-table {
    background-color: transparent;
  }
</style>
