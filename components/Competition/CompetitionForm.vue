<script>
  import {
    ref,
    reactive,
    toRef,
    computed,
    watchEffect,
    useRouter,
    useStore
  } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'
  import { isRequired, isNumber } from '@/functions'

  export default {
    name: 'CompetitionForm',
    props: {
      record: { type: Object, default: null },
      close: { type: Boolean, default: false }
    },
    setup (props) {
      const attributes = reactive({
        season: null,
        name: '',
        presetFormat: null,
        numTeams: null,
        numTeamsPerGroup: null,
        numAdvancesFromGroup: null
      })

      const record = toRef(props, 'record')
      const { currentSeason, seasonLabel, teamId } = useTeam()
      const dialog = ref(false)
      watchEffect(() => {
        if (dialog.value && record.value) {
          attributes.name = record.value.name
          attributes.champion = record.value.champion
          attributes.season = record.value.season
        } else {
          attributes.season = currentSeason.value
        }
      })

      const store = useStore()
      const championOptions = computed(() => {
        if (!record.value) {
          return []
        }

        const lastStage = store.$db().model('Stage')
          .query()
          .where('competitionId', record.value.id)
          .orderBy('id')
          .last()

        if (lastStage) {
          if (lastStage.table) {
            return store.$db().model('TableRow')
              .query()
              .whereHas('stage', query => {
                query
                  .where('competitionId', record.value.id)
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
            return store.$db().model('Fixture')
              .query()
              .where('stageId', lastStage.id)
              .all()
              .reduce((teams, row) => {
                if (row.homeTeam && !teams.includes(row.homeTeam)) {
                  teams.push(row.homeTeam)
                }
                if (row.awayTeam && !teams.includes(row.awayTeam)) {
                  teams.push(row.awayTeam)
                }
                return teams
              }, [])
          }
        } else {
          return []
        }
      })

      const router = useRouter()
      const submit = async () => {
        if (record.value) {
          await store.dispatch('competitions/update', {
            id: record.value.id,
            attributes
          })
        } else {
          const { id: competitionId } = await store.dispatch('competitions/create', {
            teamId: teamId.value,
            attributes
          })
          router.push({
            name: 'teams-teamId-competitions-competitionId',
            params: {
              teamId: teamId.value,
              competitionId
            }
          })
        }
      }

      const title = computed(() => {
        if (props.close) {
          return 'Close Competition'
        } else if (record.value) {
          return 'Edit Competition'
        } else {
          return 'New Competition'
        }
      })

      return {
        dialog,
        attributes,
        rulesFor: {
          name: [isRequired('Name')],
          numTeams: [
            isRequired('Number of Teams'),
            isNumber('Number of Teams')
          ],
          numTeamsPerGroup: [
            isRequired('Teams per Group'),
            isNumber('Teams per Group')
          ],
          numAdvancesFromGroup: [
            isRequired('Teams Advance per Group'),
            isNumber('Teams Advance per Group')
          ],
          champion: [isRequired('Champion')]
        },
        presetFormats: [
          'League',
          'Knockout',
          'Group + Knockout'
        ],
        championOptions,
        seasonLabel,
        currentSeason,
        title,
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
        <v-btn v-on="on">
          <v-icon left>mdi-plus-circle-outline</v-icon>
          Competition
        </v-btn>
      </slot>
    </template>
    <template #form>
      <v-col
        v-if="close"
        cols="12"
      >
        <v-autocomplete
          v-model="attributes.champion"
          label="Champion"
          prepend-icon="mdi-crown"
          :items="championOptions"
          :rules="rulesFor.champion"
        />
      </v-col>
      <v-row
        v-else
        dense
      >
        <v-col cols="12">
          <v-text-field
            :value="seasonLabel(currentSeason)"
            label="Season"
            prepend-icon="mdi-calendar-text"
            disabled
          />
        </v-col>
        <v-col cols="12">
          <competition-combobox
            v-model="attributes.name"
            label="Name"
            prepend-icon="mdi-trophy"
            :rules="rulesFor.name"
          />
        </v-col>
        <template v-if="!record">
          <v-col cols="12">
            <v-select
              v-model="attributes.presetFormat"
              label="Preset Format"
              prepend-icon="mdi-cogs"
              :items="presetFormats"
              clearable
            />
          </v-col>
          <v-scroll-y-transition mode="out-in">
            <v-col
              v-if="attributes.presetFormat"
              cols="12"
            >
              <v-text-field
                v-model.number="attributes.numTeams"
                label="Number of Teams"
                prepend-icon="mdi-account-group"
                :rules="rulesFor.numTeams"
                inputmode="numeric"
              />
            </v-col>
          </v-scroll-y-transition>
          <v-scroll-y-transition mode="out-in">
            <v-row
              v-if="attributes.presetFormat === 'Group + Knockout'"
              dense
            >
              <v-col cols="12">
                <v-text-field
                  v-model.number="attributes.numTeamsPerGroup"
                  label="Teams per Group"
                  prepend-icon="mdi-table"
                  :rules="rulesFor.numTeamsPerGroup"
                  inputmode="numeric"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="attributes.numAdvancesFromGroup"
                  label="Teams Advance per Group"
                  prepend-icon="mdi-tournament"
                  :rules="rulesFor.numAdvancesFromGroup"
                  inputmode="numeric"
                />
              </v-col>
            </v-row>
          </v-scroll-y-transition>
        </template>
      </v-row>
    </template>
  </dialog-form>
</template>
