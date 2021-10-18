<script>
  import { ref, toRefs, computed, useStore } from '@nuxtjs/composition-api'
  import { useCompetition } from '@/composables'

  export default {
    name: 'RoundStage',
    props: {
      round: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    setup (props) {
      const key = ref(0)

      const { round, readonly } = toRefs(props)
      const items = computed(() => Object.values(round.value.fixtures) || [])

      const headers = computed(() => [
        { text: 'Home Team', value: 'homeTeam', align: 'right' },
        { text: 'Score', value: 'score', align: 'center' },
        { text: 'Away Team', value: 'awayTeam' },
        ...(readonly.value ? [] : [{ text: '', value: 'edit', width: 120 }])
      ])

      const store = useStore()
      const updateStageAttribute = async (stageId, attribute, value) => {
        try {
          await store.dispatch('stages/update', {
            id: stageId,
            attributes: { [attribute]: value }
          })
        } catch (e) {
          key.value++
          store.commit('broadcaster/announce', {
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
        :item="round"
        attribute="name"
        label="Stage Name"
        :readonly="readonly"
        display-class="font-weight-light"
        @close="updateStageAttribute(round.id, 'name', $event)"
      />
      <v-spacer />
      <template v-if="!readonly">
        <fixture-form
          :stage="round"
          class="d-inline-block"
        />
        <record-remove
          :record="round"
          store="stages"
          :label="round.name"
        />
      </template>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="-1"
      :mobile-breakpoint="0"
      disable-sort
      hide-default-footer
    >
      <template #item="{ item }">
        <tr>
          <td :class="`text-right ${teamClass(item.homeTeam)}`">
            {{ item.homeTeam }}
          </td>
          <td class="text-center">
            <div
              v-for="leg in item.legs"
              :key="leg.id"
            >
              {{ leg.score }}
            </div>
          </td>
          <td :class="teamClass(item.awayTeam)">{{ item.awayTeam }}</td>
          <td v-if="!readonly">
            <fixture-form
              :stage="round"
              :record="item"
              class="d-inline-block"
            >
              <template #activator="{ on }">
                <tooltip-button
                  label="Edit Fixture"
                  icon="mdi-pencil"
                  color="orange"
                  :on="on"
                />
              </template>
            </fixture-form>
            <record-remove
              :record="item"
              store="fixtures"
              label="Fixture"
            />
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>
