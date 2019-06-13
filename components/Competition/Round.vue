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
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              v-on="on"
              icon
              @click="addFixture"
            >
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </template>
          Add Fixture
        </v-tooltip>

        <stage-remove :stage="round" />
      </template>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="items"
      disable-sort
      disable-pagination
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
    </v-data-table>

  </v-card>
</template>

<script>
  import { mapActions } from 'vuex'
  import { CompetitionAccessible } from '@/mixins'
  import { InlineField } from '@/helpers'
  import StageRemove from '@/components/Stage/Remove'

  export default {
    mixins: [
      CompetitionAccessible
    ],
    components: {
      InlineField,
      StageRemove
    },
    props: {
      round: {
        type: Object,
        required: true
      },
      readonly: Boolean
    },
    data: () => ({
      key: 0,
      headers: [
        {
          text: 'Home Team',
          value: 'home_team',
          sortable: false,
          align: 'right'
        },
        {
          text: 'Home Score',
          value: 'home_score',
          sortable: false,
          align: 'right'
        },
        {
          text: 'Away Score',
          value: 'away_score',
          sortable: false,
          align: 'left'
        },
        {
          text: 'Away Team',
          value: 'away_team',
          sortable: false,
          align: 'left'
        }
      ]
    }),
    computed: {
      items () {
        return Object.values(this.round.fixtures) || []
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
