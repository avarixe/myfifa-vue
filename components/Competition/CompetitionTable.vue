<template>
  <v-expansion-panel-content class="elevation-1">
    <div slot="header">
      <template v-if="edit">
        <v-text-field
          v-model="stage.name"
          :rules="$_validate('Stage Name', ['required'])"
          class="d-inline-block"
          @click.stop
        ></v-text-field>
      </template>
      <template v-else>
        {{ table.name }}
      </template>

      <template v-if="!readonly">
        <edit-mode-button
          :mode="edit"
          :changed="stageChanged"
          v-on:toggle-mode="edit = !edit"
        ></edit-mode-button>
        <stage-remove :stage="table"></stage-remove>
      </template>
    </div>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="items"
        :pagination.sync="pagination"
        disable-initial-sort
        hide-actions>
        <template slot="items" slot-scope="props">
          <table-row
            :headers="headers"
            :row-data="props.item"
          ></table-row>
        </template>
      </v-data-table>
    </v-card>
  </v-expansion-panel-content>
</template>

<script>
  import EditModeButton from '@/components/EditModeButton'
  import StageRemove from '@/components/Competition/StageRemove'
  import TableRow from '@/components/Competition/TableRow'

  export default {
    components: {
      EditModeButton,
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
      stage: {},
      edit: false,
      pagination: {
        rowsPerPage: -1
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
        return this.$_orderBy(
          Object.values(this.table.table_rows || {}),
          ['points', 'goal_difference', 'goals_for', 'goals_against'],
          ['desc', 'desc', 'desc', 'desc']
        )
      },
      stageChanged () {
        return this.stage.name !== this.table.name
      }
    },
    watch: {
      edit (val) {
        if (val) {
          const { id, name } = this.table
          this.stage = { id, name }
        } else if (this.stageChanged) {
          this.$store.dispatch('stage/update', this.stage)
        }
      }
    }
  }
</script>
