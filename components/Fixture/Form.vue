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
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-combobox
              v-model="fixture.home_team"
              label="Home Team"
              :items="competitionTeams"
              prepend-icon="mdi-shield-half-full"
              spellcheck="false"
              autocapitalize="words"
              autocomplete="off"
              autocorrect="off"
            />
          </v-col>
          <v-col cols="12">
            <v-combobox
              v-model="fixture.away_team"
              label="Away Team"
              :items="competitionTeams"
              prepend-icon="mdi-shield-half-full"
              spellcheck="false"
              autocapitalize="words"
              autocomplete="off"
              autocorrect="off"
            />
          </v-col>
          <v-col
            cols="12"
            class="text-center"
          >
            <v-btn
              outlined
              @click="addLeg"
            >
              Add Fixture Leg
            </v-btn>
          </v-col>
          <v-row
            v-for="(leg, i) in fixture.legs_attributes"
            v-show="!leg._destroy"
            :key="i"
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
                @click:append-outer="leg._destroy = true"
              />
            </v-col>
          </v-row>
        </v-row>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { mapActions } from 'vuex'
  import { CompetitionAccessible, DialogFormable } from '@/mixins'
  import { TooltipButton } from '@/helpers'

  const mix = mixins(CompetitionAccessible, DialogFormable)

  @Component({
    components: {
      TooltipButton
    },
    methods: mapActions('fixtures', {
      create: 'CREATE',
      update: 'UPDATE'
    })
  })
  export default class FixtureForm extends mix {
    @Prop({ type: Object, required: true }) stage
    @Prop(Object) fixtureData

    fixture = {
      home_team: '',
      away_team: '',
      legs_attributes: [{
        home_score: '',
        away_score: '',
        _destroy: false
      }]
    }

    get title () {
      return this.fixtureData ? 'Edit Fixture' : 'Add Fixture'
    }

    @Watch('dialog')
    setFixture (val) {
      if (val && this.fixtureData) {
        Object.assign(this.fixture, this.$_pick(this.fixtureData, [
          'id',
          'home_team',
          'away_team'
        ]))
        this.fixture.legs_attributes = this.fixtureData.legs.map(leg => ({
          id: leg.id,
          home_score: leg.home_score,
          away_score: leg.away_score,
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
    }

    async submit () {
      if (this.fixtureData) {
        await this.update(this.fixture)
      } else {
        await this.create({
          stageId: this.stage.id,
          fixture: this.fixture
        })
      }
    }
  }
</script>
