<template>
  <material-card>
    <template #header>
      <span class="title font-weight-light mb-2">Teams</span>
      <team-form>
        <template #default="{ on: dialog }">
          <v-tooltip bottom>
            <template #activator="{ on: tooltip }">
              <v-btn
                v-on="{ ...dialog, ...tooltip }"
                flat
              >
                <v-icon left>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </template>
            New Team
          </v-tooltip>
        </template>
      </team-form>
    </template>

    <v-data-table
      :headers="headers"
      :items="rows"
      :loading="loading"
      item-key="id"
      disable-initial-sort
      no-data-text="No Teams Recorded"
    >
      <template #headerCell="{ header }">
        <span class="subheading font-weight-light text-success text--darken-3">{{ header.text }}</span>
      </template>
      <template #items="{ item }">
        <tr>
          <td class="text-xs-center">{{ item.title }}</td>
          <td class="text-xs-center">{{ $_format($_parse(item.start_date), 'MMM DD, YYYY') }}</td>
          <td class="text-xs-center">{{ $_format($_parse(item.current_date), 'MMM DD, YYYY') }}</td>
          <td class="text-xs-right">
            <team-actions :team="item" />
          </td>
        </tr>
      </template>
    </v-data-table>

  </material-card>
</template>

<script>
  import { Team } from '@/models'
  import { mapActions } from 'vuex'
  import MaterialCard from '@/components/theme/Card'
  import TeamForm from './TeamForm'
  import TeamActions from './TeamActions'

  export default {
    components: {
      MaterialCard,
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
      }
    }
  }
</script>

<style scoped>
  >>> .v-btn-toggle .v-btn {
    opacity: 1;
  }
</style>
