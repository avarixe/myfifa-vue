<template>
  <v-card outlined>
    <v-card-title>
      <div class="title">
        <template v-if="edit">
          <v-text-field
            v-model="stage.name"
            :rules="$_validate('Stage Name', ['required'])"
            class="d-inline-block"
            @click.stop
          />
        </template>
        <span v-else>{{ round.name }}</span>
      </div>

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
        <edit-td
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
        <edit-td
          :item="item"
          attribute="home_score"
          label="Home Score"
          @close="updateFixtureAttribute(item.id, 'home_score', $event)"
          :readonly="readonly"
          :display-class="teamClass(item.home_team)"
        />
      </template>
      <template #item.away_score="{ item }">
        <edit-td
          :item="item"
          attribute="away_score"
          label="Away Score"
          @close="updateFixtureAttribute(item.id, 'away_score', $event)"
          :readonly="readonly"
          :display-class="teamClass(item.away_team)"
        />
      </template>
      <template #item.away_team="{ item }">
        <edit-td
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
  import { EditTd } from '@/helpers'
  import StageRemove from './StageRemove'

  export default {
    mixins: [
      CompetitionAccessible
    ],
    components: {
      EditTd,
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
      stage: {},
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
      ],
      edit: false,
      override: false
    }),
    computed: {
      items () {
        return Object.values(this.round.fixtures) || []
      },
      stageChanged () {
        return this.stage.name !== this.round.name
      }
    },
    watch: {
      edit (val) {
        if (val) {
          const { id, name } = this.round
          this.stage = { id, name }
        } else if (this.stageChanged) {
          this.updateStage(this.stage)
        }
      }
    },
    methods: {
      ...mapActions({
        createFixture: 'fixtures/CREATE',
        updateFixture: 'fixtures/UPDATE',
        updateStage: 'stages/UPDATE'
      }),
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
