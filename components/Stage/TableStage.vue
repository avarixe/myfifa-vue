<script>
  import { ref, toRefs, computed, useStore } from '@nuxtjs/composition-api'
  import orderBy from 'lodash.orderby'
  import { useCompetition } from '@/composables'

  export default {
    name: 'TableStage',
    props: {
      table: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    setup (props) {
      const key = ref(0)

      const { table, readonly } = toRefs(props)
      const headers = computed(() => [
        { text: '#', value: 'standing', align: 'center', width: 60 },
        { text: 'Team', value: 'name' },
        { text: 'W', value: 'wins', align: 'center' },
        { text: 'D', value: 'draws', align: 'center' },
        { text: 'L', value: 'losses', align: 'center' },
        { text: 'GF', value: 'goalsFor', align: 'center' },
        { text: 'GA', value: 'goalsAgainst', align: 'center' },
        { text: 'GD', value: 'goalDifference', align: 'center' },
        { text: 'PTS', value: 'points', align: 'center' },
        ...(readonly.value ? [] : [{ text: '', value: 'edit', sortable: false, width: 120 }])
      ])

      const items = computed(() => orderBy(
        table.value.tableRows,
        ['points', 'goalDifference', 'goalsFor', 'name'],
        ['desc', 'desc', 'desc', 'asc']
      ).map((row, i) => ({ ...row, standing: i + 1 })))

      const store = useStore()
      const updateStageAttribute = async (stageId, attribute, value) => {
        try {
          await store.dispatch('stages/update', {
            id: stageId,
            attributes: { [attribute]: value }
          })
        } catch (e) {
          key.value++
          store.commit('broadcast/announce', {
            message: e.message,
            color: 'red'
          })
        }
      }

      const { teamClass } = useCompetition()

      return {
        key,
        headers,
        items,
        updateStageAttribute,
        teamClass
      }
    }
  }
</script>

<template>
  <v-card flat>
    <v-card-title>
      <inline-field
        :key="key"
        :item="table"
        attribute="name"
        label="Table Name"
        :readonly="readonly"
        display-class="font-weight-light"
        @close="updateStageAttribute(table.id, 'name', $event)"
      />
      <v-spacer />
      <template v-if="!readonly">
        <table-row-form
          :stage="table"
          class="d-inline-block"
        />
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
      :mobile-breakpoint="0"
      sort-by="standing"
      must-sort
      :items-per-page="-1"
      hide-default-footer
    >
      <template #item="{ item }">
        <tr :class="`text-center ${teamClass(item.name)}`">
          <td class="text-caption text--secondary ">{{ item.standing }}</td>
          <td class="text-left">{{ item.name }}</td>
          <td>{{ item.wins }}</td>
          <td>{{ item.draws }}</td>
          <td>{{ item.losses }}</td>
          <td>{{ item.goalsFor }}</td>
          <td>{{ item.goalsAgainst }}</td>
          <td>{{ item.goalDifference }}</td>
          <td>{{ item.points }}</td>
          <td v-if="!readonly">
            <table-row-form
              :stage="table"
              :record="item"
              class="d-inline-block"
            >
              <template #activator="{ on }">
                <tooltip-button
                  label="Edit Table Row"
                  icon="mdi-pencil"
                  color="orange"
                  :on="on"
                  small
                />
              </template>
            </table-row-form>
            <record-remove
              :record="item"
              store="tableRows"
              label="Table Row"
              small
            />
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>
