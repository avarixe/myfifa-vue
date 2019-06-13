<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <template v-if="edit">
        <v-text-field
          v-model="stage.name"
          :rules="$_validate('Stage Name', ['required'])"
          class="d-inline-block"
          @click.stop
        />
      </template>
      <span v-else>{{ table.name }}</span>
    </v-expansion-panel-header>

    <v-expansion-panel-content class="elevation-1">
      <div
        v-if="!readonly"
        class="text-xs-center my-1"
      >
        <stage-remove :stage="table">
          <template #default="{ on }">
            <v-btn
              dark
              small
            >Remove</v-btn>
          </template>
        </stage-remove>
      </div>

      <v-flex xs12>
        <v-card flat>
          <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page="-1"
            :mobile-breakpoint="0"
            disable-sort
            hide-default-footer
          >
            <template #item="{ item }">
              <table-row
                :headers="headers"
                :row-data="item"
                :override="override"
              />
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
  import StageRemove from './StageRemove'
  import TableRow from './TableRow'

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
      stage: {},
      edit: false,
      override: false
    }),
    computed: {
      headers () {
        let headers = [
          {
            text: 'Team',
            value: 'name',
            type: 'text',
            align: 'left'
          },
          {
            text: 'W',
            value: 'wins',
            type: 'number',
            align: 'center'
          },
          {
            text: 'D',
            value: 'draws',
            type: 'number',
            align: 'center'
          },
          {
            text: 'L',
            value: 'losses',
            type: 'number',
            align: 'center'
          },
          {
            text: 'GF',
            value: 'goals_for',
            type: 'number',
            align: 'center'
          },
          {
            text: 'GA',
            value: 'goals_against',
            type: 'number',
            align: 'center'
          },
          {
            text: 'GD',
            value: 'goal_difference',
            type: null,
            align: 'center'
          },
          {
            text: 'PTS',
            value: 'points',
            type: null,
            align: 'center'
          }
        ]
        !this.readonly && headers.unshift({
          text: '',
          value: null,
          sortable: false,
          width: '40px'
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
