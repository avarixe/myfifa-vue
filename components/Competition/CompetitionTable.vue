<template>
  <v-card>
    <v-card-title>
      <div class="title">{{ table.name }}</div>
      <stage-remove :stage="table"></stage-remove>
    </v-card-title>
    <v-card-text>
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
  </v-card-text>
  </v-card>
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
      }
    },
    data () {
      return {
        headers: [
          { text: '', value: null, sortable: false, width: '40px' },
          { text: 'Team', value: 'name', type: 'text', align: 'left' },
          { text: 'W', value: 'wins', type: 'number', align: 'center' },
          { text: 'D', value: 'draws', type: 'number', align: 'center' },
          { text: 'L', value: 'losses', type: 'number', align: 'center' },
          { text: 'GF', value: 'goals_for', type: 'number', align: 'center' },
          { text: 'GA', value: 'goals_against', type: 'number', align: 'center' },
          { text: 'GD', value: 'goal_difference', type: null, align: 'center' },
          { text: 'PTS', value: 'points', type: null, align: 'center' }
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
        return Object.values(this.table.table_rows) || []
      }
    }
  }
</script>
