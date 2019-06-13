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

    <v-expansion-panel-content>
      <div
        v-if="!readonly"
        class="text-xs-center my-1"
      >
        <edit-mode-button
          :mode="edit"
          :changed="stageChanged"
          text
          @toggle-mode="edit = !edit"
        />

        <stage-remove :stage="table">
          <template #default="{ on }">
            <v-btn
              dark
              small
            >Remove</v-btn>
          </template>
        </stage-remove>
      </div>

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
          <edit-td
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
          <edit-td
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
          <edit-td
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
          <edit-td
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
          <edit-td
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
          <edit-td
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
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
  import { mapActions } from 'vuex'
  import { CompetitionAccessible } from '@/mixins'
  import { EditModeButton, EditTd } from '@/helpers'
  import StageRemove from './StageRemove'

  export default {
    mixins: [
      CompetitionAccessible
    ],
    components: {
      EditModeButton,
      EditTd,
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
      stage: {},
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
      ],
      edit: false,
      override: false
    }),
    computed: {
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
          this.updateStage(this.stage)
        }
      }
    },
    methods: {
      ...mapActions({
        updateStage: 'stages/UPDATE',
        updateRow: 'tableRows/UPDATE'
      }),
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
