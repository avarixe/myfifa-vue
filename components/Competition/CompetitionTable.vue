<template>
  <v-card flat>
    <v-card-title>
      <inline-field
        :key="key"
        :item="table"
        attribute="name"
        :readonly="readonly"
        @close="updateStageAttribute(table.id, 'name', $event)"
        display-class="font-weight-light"
      />

      <v-spacer />

      <stage-remove :stage="table" />
    </v-card-title>

    <v-card-text>
      <v-data-table
        :key="key"
        :headers="headers"
        :items="items"
        :items-per-page="-1"
        :mobile-breakpoint="0"
        disable-sort
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
            label="W"
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
            label="D"
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
            label="L"
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
            label="GF"
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
            label="GA"
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
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapActions } from 'vuex'
  import { CompetitionAccessible } from '@/mixins'
  import { InlineField } from '@/helpers'
  import StageRemove from '@/components/Stage/StageRemove'

  export default {
    mixins: [
      CompetitionAccessible
    ],
    components: {
      InlineField,
      StageRemove
    },
    props: {
      table: {
        type: Object,
        required: true
      },
      readonly: Boolean
    },
    data: () => ({
      key: 0,
      headers: [
        {
          text: 'Team',
          value: 'name',
          align: 'left'
        },
        {
          text: 'W',
          value: 'wins',
          align: 'center'
        },
        {
          text: 'D',
          value: 'draws',
          align: 'center'
        },
        {
          text: 'L',
          value: 'losses',
          align: 'center'
        },
        {
          text: 'GF',
          value: 'goals_for',
          align: 'center'
        },
        {
          text: 'GA',
          value: 'goals_against',
          align: 'center'
        },
        {
          text: 'GD',
          value: 'goal_difference',
          align: 'center'
        },
        {
          text: 'PTS',
          value: 'points',
          align: 'center'
        }
      ]
    }),
    computed: {
      items () {
        return this.$_orderBy(
          Object.values(this.table.table_rows || {}),
          ['points', 'goal_difference', 'goals_for', 'goals_against'],
          ['desc', 'desc', 'desc', 'desc']
        )
      }
    },
    methods: {
      ...mapActions({
        updateStage: 'stages/UPDATE',
        updateRow: 'tableRows/UPDATE'
      }),
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
      },
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
  }
</script>

<style scoped>
  >>> .v-expansion-panel-content__wrap {
    width: 100%;
  }
</style>
