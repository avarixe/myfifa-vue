<template>
  <v-card flat>
    <v-card-title>
      <inline-field
        :key="key"
        :item="table"
        attribute="name"
        :label="table.name"
        :readonly="readonly"
        @close="updateStageAttribute(table.id, 'name', $event)"
        display-class="font-weight-light"
      />

      <v-spacer />

      <template v-if="!readonly">
        <table-row-form :stage="table" />
        <record-remove
          :record="table"
          store="stages"
          :label="table.name"
        />
      </template>
    </v-card-title>

    <v-data-table
      :key="key"
      :headers="headers"
      :items="items"
      :sort-by="['points', 'goal_difference', 'goals_for', 'goals_against']"
      :sort-desc="[true, true, true, true]"
      multi-sort
      :items-per-page="-1"
      hide-default-footer
    >
      <template #item.name="{ item }">
        <span :class="teamClass(item.name)">{{ item.name }}</span>
      </template>
      <template #item.wins="{ item }">
        <span :class="teamClass(item.name)">{{ item.wins }}</span>
      </template>
      <template #item.draws="{ item }">
        <span :class="teamClass(item.name)">{{ item.draws }}</span>
      </template>
      <template #item.losses="{ item }">
        <span :class="teamClass(item.name)">{{ item.losses }}</span>
      </template>
      <template #item.goals_for="{ item }">
        <span :class="teamClass(item.name)">{{ item.goals_for }}</span>
      </template>
      <template #item.goals_against="{ item }">
        <span :class="teamClass(item.name)">{{ item.goals_against }}</span>
      </template>
      <template #item.goal_difference="{ item }">
        <span :class="teamClass(item.name)">{{ item.goal_difference }}</span>
      </template>
      <template #item.points="{ item }">
        <span :class="teamClass(item.name)">{{ item.points }}</span>
      </template>
      <template #item.actions="{ item }">
        <table-row-form
          :stage="table"
          :row-data="item"
        >
          <template #default="{ on }">
            <v-tooltip bottom>
              <template #activator="{ on: tooltip }">
                <v-btn
                  v-on="{ ...on, ...tooltip }"
                  icon
                >
                  <v-icon color="orange">mdi-pencil</v-icon>
                </v-btn>
              </template>
              Edit Table Row
            </v-tooltip>
          </template>
        </table-row-form>
        <record-remove
          :record="item"
          store="tableRows"
          label="Table Row"
        />
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import { mixins, Component, Prop } from 'nuxt-property-decorator'
  import { CompetitionAccessible } from '@/mixins'
  import { InlineField, RecordRemove } from '@/helpers'
  import TableRowForm from '@/components/TableRow/Form'

  @Component({
    components: {
      InlineField,
      RecordRemove,
      TableRowForm
    }
  })
  export default class TableStage extends mixins(CompetitionAccessible) {
    @Prop({ type: Object, required: true }) table
    @Prop(Boolean) readonly

    key = 0

    get items () {
      return Object.values(this.table.table_rows || {})
    }

    get headers () {
      const headers = [
        { text: 'Team', value: 'name', sortable: false },
        { text: 'W', value: 'wins', align: 'center' },
        { text: 'D', value: 'draws', align: 'center' },
        { text: 'L', value: 'losses', align: 'center' },
        { text: 'GF', value: 'goals_for', align: 'center' },
        { text: 'GA', value: 'goals_against', align: 'center' },
        { text: 'GD', value: 'goal_difference', align: 'center' },
        { text: 'PTS', value: 'points', align: 'center' }
      ]

      if (!this.readonly) {
        headers.push({
          text: '',
          value: 'actions',
          sortable: false,
          width: 120
        })
      }

      return headers
    }

    async updateStageAttribute (stageId, attribute, value) {
      try {
        await this.$store.dispatch('stages/UPDATE', {
          id: stageId,
          [attribute]: value
        })
      } catch (e) {
        this.key++
        this.$store.commit('broadcaster/ANNOUNCE', {
          message: e.message,
          color: 'red'
        })
      }
    }
  }
</script>
