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
      <v-col cols="12">
        <v-combobox
          v-model="fixture.homeTeam"
          label="Home Team"
          prepend-icon="mdi-home"
          :items="competitionTeams"
          hide-details
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-combobox
          v-model="fixture.awayTeam"
          label="Away Team"
          prepend-icon="mdi-bus"
          :items="competitionTeams"
          hide-details
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
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
              v-model="leg.homeScore"
              label="Home Score"
              prepend-icon="mdi-soccer"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="leg.awayScore"
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
        homeTeam: '',
        awayTeam: '',
        legs_attributes: [{
          homeScore: '',
          awayScore: '',
          _destroy: false
        }]
      }
    }),
    computed: {
      title () {
        return this.fixtureData ? 'Edit Fixture' : 'Add Fixture'
      }
    },
    watch: {
      dialog (val) {
        if (val && this.fixtureData) {
          this.fixture = pick(this.fixtureData, [
            'id',
            'homeTeam',
            'awayTeam'
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
        createFixture: 'create',
        updateFixture: 'update'
      }),
      addLeg () {
        this.fixture.legs_attributes.push({
          homeScore: '',
          awayScore: '',
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
