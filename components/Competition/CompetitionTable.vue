<template>
  <div>
    <v-subheader>{{ table.name }}</v-subheader>
    <v-data-table
      :headers="headers"
      :items="items"
      :pagination.sync="pagination"
      no-data-text=""
      hide-actions>
      <template slot="items" slot-scope="props">
        <table-row
          :headers="headers"
          :row-data="props.item"
        ></table-row>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import TableRow from '@/components/Competition/TableRow'

  export default {
    components: {
      TableRow
    },
    props: {
      table: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        headers: [
          { text: 'Team', value: 'name', type: 'text', align: 'left' },
          { text: 'W', value: 'wins', type: 'number', align: 'center' },
          { text: 'D', value: 'draws', type: 'number', align: 'center' },
          { text: 'L', value: 'losses', type: 'number', align: 'center' },
          { text: 'GF', value: 'goals_for', type: 'number', align: 'center' },
          { text: 'GA', value: 'goals_against', type: 'number', align: 'center' },
          { text: 'GD', value: 'goal_difference', type: null, align: 'center' },
          { text: 'PTS', value: 'points', type: null, align: 'center' },
          { text: '', value: null, align: 'right', sortable: false }
        ],
        pagination: {
          rowsPerPage: -1,
          descending: true,
          sortBy: 'points'
        }
      }
    },
    computed: {
      items () {
        return this.table.table_rows || []
      }
    }
  }
</script>
