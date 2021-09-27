<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      >
        <tooltip-button
          :label="title"
          icon="mdi-table-row-plus-after"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <team-combobox
          v-model="attributes.homeTeam"
          label="Home Team"
          prepend-icon="mdi-home"
          :default-items="teamOptions"
          hide-details
        />
      </v-col>
      <v-col cols="12">
        <team-combobox
          v-model="attributes.awayTeam"
          label="Away Team"
          prepend-icon="mdi-bus"
          :default-items="teamOptions"
          hide-details
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
          v-for="(leg, i) in attributes.legsAttributes"
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
      record: { type: Object, default: null }
    },
    data: () => ({
      key: 0,
      attributes: {
        homeTeam: '',
        awayTeam: '',
        legsAttributes: [{
          homeScore: '',
          awayScore: '',
          _destroy: false
        }]
      },
      expandHomeOptions: false,
      expandAwayOptions: false
    }),
    computed: {
      title () {
        return this.record ? 'Edit Fixture' : 'Add Fixture'
      },
      previousStage () {
        return this.$store.$db().model('Stage')
          .query()
          .where('competitionId', this.competition.id)
          .where(stage => stage.id < this.stage.id)
          .last()
      },
      teamOptions () {
        if (this.previousStage) {
          if (this.previousStage.table) {
            // get all Team options from table stages
            return this.$store.$db().model('TableRow')
              .query()
              .whereHas('stage', query => {
                query
                  .where('competitionId', this.competition.id)
                  .where('table', true)
              })
              .all()
              .reduce((teams, row) => {
                if (row.name && !teams.includes(row.name)) {
                  teams.push(row.name)
                }
                return teams
              }, [])
          } else {
            // get all Team options from previous stage
            return this.$store.$db().model('Fixture')
              .query()
              .where('stageId', this.previousStage.id)
              .all()
              .reduce((teams, fixture) => {
                if (fixture.homeTeam && !teams.includes(fixture.homeTeam)) {
                  teams.push(fixture.homeTeam)
                }
                if (fixture.awayTeam && !teams.includes(fixture.awayTeam)) {
                  teams.push(fixture.awayTeam)
                }
                return teams
              }, [])
          }
        } else {
          return []
        }
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.attributes = pick(this.record, [
            'homeTeam',
            'awayTeam'
          ])
          this.attributes.legsAttributes = this.record.legs.map(leg => ({
            ...pick(leg, ['id', 'homeScore', 'awayScore']),
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
        this.attributes.legsAttributes.push({
          homeScore: '',
          awayScore: '',
          _destroy: false
        })
        this.key++
      },
      async submit () {
        if (this.record) {
          await this.updateFixture({
            id: this.record.id,
            attributes: this.attributes
          })
        } else {
          await this.createFixture({
            stageId: this.stage.id,
            attributes: this.attributes
          })
        }
      }

    }
  }
</script>
