<template>
  <v-card outlined>
    <v-card-text>
      <paged-table
        v-model="page"
        :page-count="pageCount"
      >
        <template #table>
          <v-data-table
            :headers="headers"
            :items="rows"
            :page.sync="page"
            :loading="loading"
            item-key="id"
            no-data-text="No Teams Recorded"
            hide-default-footer
            @page-count="pageCount = $event"
          >
            <template #item.title="{ item }">
              <v-btn
                :to="teamLink(item)"
                nuxt
                text
                color="info"
              >{{ item.title }}</v-btn>
            </template>
            <template #item.start_date="{ item }">
              {{ $_format($_parse(item.start_date), 'MMM DD, YYYY') }}
            </template>
            <template #item.current_date="{ item }">
              {{ $_format($_parse(item.current_date), 'MMM DD, YYYY') }}
            </template>
          </v-data-table>
        </template>
      </paged-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { Vue, Component } from 'nuxt-property-decorator'
  import { Team } from '@/models'
  import { PagedTable } from '@/helpers'

  @Component({
    components: {
      PagedTable
    }
  })
  export default class TeamGrid extends Vue {
    headers = [
      { text: 'Team Name', value: 'title', align: 'center' },
      { text: 'Start Date', value: 'start_date', align: 'center' },
      { text: 'Current Date', value: 'current_date', align: 'center' }
    ]
    loading = false
    search = ''
    page = 1
    pageCount = 0

    get teams () {
      return Team.all()
    }

    get rows () {
      return this.$_orderBy(this.teams, ['id'], ['desc'])
    }

    mounted () {
      this.reloadTable()
    }

    async reloadTable () {
      this.loading = true
      try {
        await this.$store.dispatch('teams/FETCH')
      } catch (e) {
        alert(e.message)
      } finally {
        this.loading = false
      }
    }

    teamLink (team) {
      return {
        name: 'teams-teamId',
        params: { teamId: team.id }
      }
    }
  }
</script>
