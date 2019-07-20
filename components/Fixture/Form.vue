<template>
  <dialog-form
    v-model="dialog"
    title="Add Fixture"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <v-tooltip bottom>
          <template #activator="{ on: tooltip }">
            <v-btn
              v-on="{ ...on, ...tooltip }"
              icon
            >
              <v-icon>mdi-table-row-plus-after</v-icon>
            </v-btn>
          </template>
          Add Fixture
        </v-tooltip>
      </slot>
    </template>

    <template #form>
      <v-container grid-list-xs>
        <v-layout wrap>
          <v-flex xs12>
            <v-combobox
              v-model="fixture.home_team"
              label="Home Team"
              :items="competitionTeams"
              prepend-icon="mdi-shield-half-full"
            />
          </v-flex>
          <v-flex xs12>
            <v-combobox
              v-model="fixture.away_team"
              label="Away Team"
              :items="competitionTeams"
              prepend-icon="mdi-shield-half-full"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              v-model="fixture.home_score"
              label="Home Score"
              prepend-icon="mdi-soccer"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              v-model="fixture.away_score"
              label="Away Score"
              prepend-icon="mdi-soccer"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { mapActions } from 'vuex'
  import { CompetitionAccessible, DialogFormable } from '@/mixins'

  const mix = mixins(CompetitionAccessible, DialogFormable)

  @Component({
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
      home_score: '',
      away_score: '',
      away_team: ''
    }

    @Watch('dialog')
    setFixture (val) {
      if (val && this.fixtureData) {
        Object.assign(this.fixture, this.$_pick(this.fixtureData, [
          'id',
          'home_team',
          'home_score',
          'away_score',
          'away_team'
        ]))
      }
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
