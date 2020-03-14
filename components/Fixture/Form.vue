<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          :label="title"
          icon="mdi-table-row-plus-after"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <dynamic-fields
        :object="fixture"
        :fields="fields"
      />
      <v-col
        class="mt-3 text-center"
        cols="12"
      >
        <v-btn @click="addLeg">Add Fixture Leg</v-btn>
      </v-col>
      <v-container :key="key">
        <v-row
          v-for="(leg, i) in fixture.legs_attributes"
          v-show="!leg._destroy"
          :key="i"
          dense
        >
          <v-col cols="6">
            <v-text-field
              v-model="leg.home_score"
              label="Home Score"
              prepend-icon="mdi-soccer"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="leg.away_score"
              label="Away Score"
              prepend-icon="mdi-soccer"
              append-outer-icon="mdi-delete"
              hide-details
              @click:append-outer="leg._destroy = true; key++"
            />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { CompetitionAccessible, DialogFormable } from '@/mixins'

  export default {
    name: 'FixtureForm',
    mixins: [
      CompetitionAccessible,
      DialogFormable
    ],
    props: {
      stage: { type: Object, required: true },
      fixtureData: { type: Object, default: null }
    },
    data: () => ({
      key: 0,
      fixture: {
        home_team: '',
        away_team: '',
        legs_attributes: [{
          home_score: '',
          away_score: '',
          _destroy: false
        }]
      }
    }),
    computed: {
      fields () {
        return [
          {
            type: 'combobox',
            attribute: 'home_team',
            label: 'Home Team',
            prependIcon: 'mdi-home',
            items: this.competitionTeams,
            hideDetails: true,
            spellcheck: 'false',
            autocapitalize: 'words',
            autocomplete: 'off',
            autocorrect: 'off'
          },
          {
            type: 'combobox',
            attribute: 'away_team',
            label: 'Away Team',
            prependIcon: 'mdi-bus',
            items: this.competitionTeams,
            hideDetails: true,
            spellcheck: 'false',
            autocapitalize: 'words',
            autocomplete: 'off',
            autocorrect: 'off'
          }
        ]
      },
      title () {
        return this.fixtureData ? 'Edit Fixture' : 'Add Fixture'
      }
    },
    watch: {
      dialog (val) {
        if (val && this.fixtureData) {
          this.fixture = pick(this.fixtureData, [
            'id',
            'home_team',
            'away_team'
          ])
          this.fixture.legs_attributes = this.fixtureData.legs.map(leg => ({
            ...leg,
            _destroy: false
          }))
        }
      }
    },
    methods: {
      ...mapActions('fixtures', {
        createFixture: 'CREATE',
        updateFixture: 'UPDATE'
      }),
      addLeg () {
        this.fixture.legs_attributes.push({
          home_score: '',
          away_score: '',
          _destroy: false
        })
        this.key++
      },
      async submit () {
        if (this.fixtureData) {
          await this.updateFixture(this.fixture)
        } else {
          await this.createFixture({
            stageId: this.stage.id,
            fixture: this.fixture
          })
        }
      }

    }
  }
</script>
