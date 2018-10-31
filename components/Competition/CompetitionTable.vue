<template>
  <v-expansion-panel-content class="elevation-1">
    <div slot="header">
      {{ table.name }}
      <stage-remove
        v-if="!readonly"
        :stage="table"
      ></stage-remove>
    </div>
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :pagination.sync="pagination"
          hide-actions>
          <template slot="items" slot-scope="props">
            <table-row
              :headers="headers"
              :row-data="props.item"
            ></table-row>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-expansion-panel-content>
</template>

<script>
  import StageRemove from '@/components/Competition/StageRemove'
  import TableRow from '@/components/Competition/TableRow'

  export default {
    components: {
      StageRemove,
      TableRow
    },
    props: {
      table: {
        type: Object,
        required: true
      },
      readonly: Boolean
    },
    data: () => ({
      pagination: {
        rowsPerPage: -1,
        descending: true,
        sortBy: 'points'
      }
    }),
    computed: {
      headers () {
        let headers = [
          { text: 'Team', value: 'name', type: 'text', align: 'left' },
          { text: 'W', value: 'wins', type: 'number', align: 'center' },
          { text: 'D', value: 'draws', type: 'number', align: 'center' },
          { text: 'L', value: 'losses', type: 'number', align: 'center' },
          { text: 'GF', value: 'goals_for', type: 'number', align: 'center' },
          { text: 'GA', value: 'goals_against', type: 'number', align: 'center' },
          { text: 'GD', value: 'goal_difference', type: null, align: 'center' },
          { text: 'PTS', value: 'points', type: null, align: 'center' }
        ]
        !this.readonly && headers.unshift({ text: '', value: null, sortable: false, width: '40px' })
        return headers
      },
      items () {
        return Object.values(this.table.table_rows) || []
      }
    }
  }
</script>
