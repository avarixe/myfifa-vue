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
        />
      </template>
      <template #item.home_score="{ item }">
        <edit-td
          :item="item"
          attribute="home_score"
          label="Home Score"
        />
      </template>
      <template #item.away_score="{ item }">
        <edit-td
          :item="item"
          attribute="away_score"
          label="Away Score"
        />
      </template>
      <template #item.away_team="{ item }">
        <edit-td
          :item="item"
          attribute="away_team"
          label="Away Team"
          input-type="combobox"
          :options="competitionTeams"
        />
      </template>
    </v-data-table>

  </v-card>
</template>

<script>
  import { CompetitionAccessible } from '@/mixins'
  import { EditTd } from '@/helpers'
  import StageRemove from './StageRemove'
  import FixtureView from './FixtureView'

  export default {
    mixins: [
      CompetitionAccessible
    ],
    components: {
      EditTd,
      StageRemove,
      FixtureView
    },
    props: {
      round: {
        type: Object,
        required: true
      },
      readonly: Boolean
    },
    data: () => ({
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
          this.$store.dispatch('stages/UPDATE', this.stage)
        }
      }
    },
    methods: {
      addFixture () {
        this.$store.dispatch('fixtures/CREATE', {
          stageId: this.round.id,
          fixture: { home_team: '', away_team: '' }
        })
      }
    }
  }
</script>
