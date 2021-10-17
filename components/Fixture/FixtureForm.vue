<script>
  import {
    ref,
    reactive,
    toRef,
    computed,
    watchEffect,
    useStore
  } from '@nuxtjs/composition-api'
  import { useCompetition } from '@/composables'

  export default {
    name: 'FixtureForm',
    props: {
      stage: { type: Object, required: true },
      record: { type: Object, default: null }
    },
    setup (props) {
      const key = ref(0)
      const attributes = reactive({
        homeTeam: '',
        awayTeam: '',
        legsAttributes: [{
          homeScore: '',
          awayScore: '',
          _destroy: false
        }]
      })

      const record = toRef(props, 'record')

      const title = computed(() => record.value ? 'Edit Fixture' : 'Add Fixture')

      const { competitionId } = useCompetition()
      const teamOptions = computed(() => {
        if (!record.value) {
          return []
        }

        const previousStage = store.$db().model('Stage')
          .query()
          .where('competitionId', parseInt(competitionId.value))
          .where(stage => stage.id < props.stage.id)
          .last()

        if (previousStage) {
          if (previousStage.table) {
            // get all Team options from table stages
            return store.$db().model('TableRow')
              .query()
              .whereHas('stage', query => {
                query
                  .where('competitionId', parseInt(competitionId.value))
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
            return store.$db().model('Fixture')
              .query()
              .where('stageId', previousStage.id)
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
      })

      const dialog = ref(false)
      watchEffect(() => {
        if (dialog.value && record.value) {
          attributes.homeTeam = record.value.homeTeam
          attributes.awayTeam = record.value.awayTeam
          attributes.legsAttributes = record.value.legs.map(leg => ({
            id: leg.id,
            homeScore: leg.homeScore,
            awayScore: leg.awayScore,
            _destroy: false
          }))
        }
      })

      const addLeg =  () => {
        attributes.legsAttributes.push({
          homeScore: '',
          awayScore: '',
          _destroy: false
        })
        key.value++
      }

      const store = useStore()
      const submit = async () => {
        if (record.value) {
          await store.dispatch('fixtures/update', {
            id: record.value.id,
            attributes
          })
        } else {
          await store.dispatch('fixtures/create', {
            stageId: props.stage.id,
            attributes
          })
        }
      }

      return {
        key,
        attributes,
        teamOptions,
        dialog,
        title,
        addLeg,
        submit
      }
    }
  }
</script>

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
