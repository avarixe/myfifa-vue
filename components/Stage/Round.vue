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
        <fixture-form :stage="round" />
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
      <template #item.home_team="{ item }">
        <span :class="teamClass(item.home_team)">{{ item.home_team }}</span>
      </template>
      <template #item.score="{ item }">
        <div
          v-for="leg in item.legs"
          :key="leg.id"
        >
          {{ leg.score }}
        </div>
      </template>
      <template #item.away_team="{ item }">
        <span :class="teamClass(item.away_team)">{{ item.away_team }}</span>
      </template>
      <template #item.edit="{ item }">
        <fixture-form
          :stage="round"
          :fixture-data="item"
        >
          <template #default="{ on }">
            <tooltip-button
              label="Edit Fixture"
              icon="mdi-pencil"
              color="orange"
              :on="on"
            />
          </template>
        </fixture-form>
      </template>
      <template #item.delete="{ item }">
        <record-remove
          :record="item"
          store="fixtures"
          label="Fixture"
        />
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { CompetitionAccessible } from '@/mixins'
  import FixtureForm from '@/components/Fixture/Form'

  export default {
    name: 'RoundStage',
    components: {
      FixtureForm
    },
    mixins: [
      CompetitionAccessible
    ],
    props: {
      round: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    data: () => ({
      key: 0
    }),
    computed: {
      items () {
        return Object.values(this.round.fixtures) || []
      },
      headers () {
        const headers = [
          { text: 'Home Team', value: 'home_team', align: 'right' },
          { text: 'Score', value: 'score', align: 'center' },
          { text: 'Away Team', value: 'away_team' }
        ]

        if (!this.readonly) {
          headers.push({
            text: '',
            value: 'edit',
            width: 40
          })
          headers.push({
            text: '',
            value: 'delete',
            width: 40
          })
        }

        return headers
      }
    },
    methods: {
      ...mapMutations('broadcaster', {
        announce: 'ANNOUNCE'
      }),
      ...mapActions('stages', {
        updateStage: 'UPDATE'
      }),
      async updateStageAttribute (stageId, attribute, value) {
        try {
          await this.updateStage({
            id: stageId,
            [attribute]: value
          })
        } catch (e) {
          this.key++
          this.announce({
            message: e.message,
            color: 'red'
          })
        }
      }
    }
  }
</script>
