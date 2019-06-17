<template>
  <v-card flat>
    <v-card-title>
      <inline-field
        :key="key"
        :item="round"
        attribute="name"
        :readonly="readonly"
        @close="updateStageAttribute(round.id, 'name', $event)"
        display-class="font-weight-light"
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
      :mobile-breakpoint="0"
      :items-per-page="-1"
      hide-default-footer
    >
      <template #item.home_team="{ item }">
        <inline-field
          :item="item"
          attribute="home_team"
          label="Home Team"
          input-type="combobox"
          :options="competitionTeams"
          @close="updateFixtureAttribute(item.id, 'home_team', $event)"
          :readonly="readonly"
          :display-class="teamClass(item.home_team)"
        />
      </template>
      <template #item.home_score="{ item }">
        <inline-field
          :item="item"
          attribute="home_score"
          label="Home Score"
          @close="updateFixtureAttribute(item.id, 'home_score', $event)"
          :readonly="readonly"
          :display-class="teamClass(item.home_team)"
        />
      </template>
      <template #item.away_score="{ item }">
        <inline-field
          :item="item"
          attribute="away_score"
          label="Away Score"
          @close="updateFixtureAttribute(item.id, 'away_score', $event)"
          :readonly="readonly"
          :display-class="teamClass(item.away_team)"
        />
      </template>
      <template #item.away_team="{ item }">
        <inline-field
          :item="item"
          attribute="away_team"
          label="Away Team"
          input-type="combobox"
          :options="competitionTeams"
          @close="updateFixtureAttribute(item.id, 'away_team', $event)"
          :readonly="readonly"
          :display-class="teamClass(item.away_team)"
        />
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
  import { mapActions } from 'vuex'
  import { CompetitionAccessible } from '@/mixins'
  import { InlineField, RecordRemove } from '@/helpers'
  import FixtureForm from '@/components/Fixture/Form'

  export default {
    mixins: [
      CompetitionAccessible
    ],
    components: {
      InlineField,
      RecordRemove,
      FixtureForm
    },
    props: {
      round: {
        type: Object,
        required: true
      },
      readonly: Boolean
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
          {
            text: 'Home Team',
            value: 'home_team',
            align: 'end',
            sortable: false
          },
          {
            text: 'Home Score',
            value: 'home_score',
            align: 'end',
            sortable: false
          },
          {
            text: 'Away Score',
            value: 'away_score',
            sortable: false
          },
          {
            text: 'Away Team',
            value: 'away_team',
            sortable: false
          }
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
    },
    methods: {
      ...mapActions({
        createFixture: 'fixtures/CREATE',
        updateFixture: 'fixtures/UPDATE',
        updateStage: 'stages/UPDATE'
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
      addFixture () {
        this.createFixture({
          stageId: this.round.id,
          fixture: { home_team: '', away_team: '' }
        })
      },
      updateFixtureAttribute (fixtureId, attribute, value) {
        this.updateFixture({
          id: fixtureId,
          [attribute]: value
        })
      }
    }
  }
</script>
