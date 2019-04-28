<template>
  <v-expansion-panel-content class="elevation-1">
    <template #header>
      <div>
        <template v-if="edit">
          <v-text-field
            v-model="stage.name"
            :rules="$_validate('Stage Name', ['required'])"
            class="d-inline-block"
            @click.stop
          />
        </template>
        <span v-else>{{ table.name }}</span>

        <template v-if="!readonly">
          <edit-mode-button
            :mode="edit"
            :changed="stageChanged"
            @toggle-mode="edit = !edit"
          />
          <stage-remove :stage="table" />
        </template>
      </div>
    </template>

    <v-card>
      <v-data-table
        :headers="headers"
        :items="items"
        :pagination.sync="pagination"
        disable-initial-sort
        hide-actions
      >
        <template #headers>
          <th
            v-for="(header, i) in headers"
            :key="i"
            :class="`text-xs-${header.align}`"
            :width="header.width"
          >
            <template v-if="header.value">{{ header.text }}</template>
            <v-tooltip
              v-else
              right
            >
              <template #activator="{ on }">
                <v-btn
                  v-on="on"
                  icon
                  @click="override = !override"
                >
                  <v-icon>mdi-playlist-edit</v-icon>
                </v-btn>
              </template>
              Edit All
            </v-tooltip>
          </th>
        </template>

        <template #items="{ item }">
          <table-row
            :headers="headers"
            :row-data="item"
            :override="override"
          />
        </template>
      </v-data-table>
    </v-card>
  </v-expansion-panel-content>
</template>

<script>
  import { EditModeButton } from '@/helpers'
  import StageRemove from './StageRemove'
  import TableRow from './TableRow'

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
      override: false,
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
        !this.readonly && headers.unshift({
          text: '', value: null, sortable: false, width: '40px'
        })
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
          this.$store.dispatch('stages/UPDATE', this.stage)
        }
      }
    }
  }
</script>
