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
        <inline-field
          :item="item"
          attribute="name"
          label="Team"
          input-type="combobox"
          :options="competitionTeams"
          @close="updateRowAttribute(item.id, 'name', $event)"
          :readonly="readonly"
          :display-class="teamClass(item.name)"
        />
      </template>
      <template #item.wins="{ item }">
        <inline-field
          :item="item"
          attribute="wins"
          label="Wins"
          input-type="number"
          @close="updateRowAttribute(item.id, 'wins', $event)"
          :readonly="readonly"
          :display-class="teamClass(item.name)"
        />
      </template>
      <template #item.draws="{ item }">
        <inline-field
          :item="item"
          attribute="draws"
          label="Draws"
          input-type="number"
          @close="updateRowAttribute(item.id, 'draws', $event)"
          :readonly="readonly"
          :display-class="teamClass(item.name)"
        />
      </template>
      <template #item.losses="{ item }">
        <inline-field
          :item="item"
          attribute="losses"
          label="Losses"
          input-type="number"
          @close="updateRowAttribute(item.id, 'losses', $event)"
          :readonly="readonly"
          :display-class="teamClass(item.name)"
        />
      </template>
      <template #item.goals_for="{ item }">
        <inline-field
          :item="item"
          attribute="goals_for"
          label="Goals For"
          input-type="number"
          @close="updateRowAttribute(item.id, 'goals_for', $event)"
          :readonly="readonly"
          :display-class="teamClass(item.name)"
        />
      </template>
      <template #item.goals_against="{ item }">
        <inline-field
          :item="item"
          attribute="goals_against"
          label="Goals Against"
          input-type="number"
          @close="updateRowAttribute(item.id, 'goals_against', $event)"
          :readonly="readonly"
          :display-class="teamClass(item.name)"
        />
      </template>
      <template #item.goal_difference="{ item }">
        <span :class="teamClass(item.name)">{{ item.goal_difference }}</span>
      </template>
      <template #item.points="{ item }">
        <span :class="teamClass(item.name)">{{ item.points }}</span>
      </template>
      <template #item.delete="{ item }">
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
  import { mapActions } from 'vuex'
  import { CompetitionAccessible } from '@/mixins'
  import { InlineField, RecordRemove } from '@/helpers'
  import TableRowForm from '@/components/TableRow/Form'

  @Component({
    components: {
      InlineField,
      RecordRemove,
      TableRowForm
    },
    methods: mapActions({
      updateStage: 'stages/UPDATE',
      updateRow: 'tableRows/UPDATE'
    })
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
          value: 'delete',
          sortable: false,
          width: 40
        })
      }

      return headers
    }

    async updateStageAttribute (stageId, attribute, value) {
      try {
        await this.updateStage({
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

    async updateRowAttribute (rowId, attribute, value) {
      try {
        await this.updateRow({
          id: rowId,
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
