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
        cols="12"
        class="mt-3 text-center"
      >
        <v-btn @click="addLeg">
          Add Fixture Leg
        </v-btn>
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
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { CompetitionAccessible, DialogFormable } from '@/mixins'
  import { DynamicFields, TooltipButton } from '@/helpers'

  const mix = mixins(CompetitionAccessible, DialogFormable)
  const fixtures = namespace('fixtures')

  @Component({
    components: {
      DynamicFields,
      TooltipButton
    }
  })
  export default class FixtureForm extends mix {
    @fixtures.Action('CREATE') createFixture
    @fixtures.Action('UPDATE') updateFixture
    @Prop({ type: Object, required: true }) stage
    @Prop(Object) fixtureData

    key = 0
    fixture = {
      home_team: '',
      away_team: '',
      legs_attributes: [{
        home_score: '',
        away_score: '',
        _destroy: false
      }]
    }

    get fields () {
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
    }

    get title () {
      return this.fixtureData ? 'Edit Fixture' : 'Add Fixture'
    }

    @Watch('dialog')
    setFixture (val) {
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

    addLeg () {
      this.fixture.legs_attributes.push({
        home_score: '',
        away_score: '',
        _destroy: false
      })
      this.key++
    }

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
</script>
