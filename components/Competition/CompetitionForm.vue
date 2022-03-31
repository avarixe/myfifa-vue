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
            :value="seasonLabel(season)"
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

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable } from '@/mixins'
  import { isRequired, isNumber } from '@/functions'

  const presetFormats = [
    'League',
    'Knockout',
    'Group + Knockout'
  ]

  export default {
    name: 'CompetitionForm',
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      record: { type: Object, default: null },
      close: { type: Boolean, default: false }
    },
    data: () => ({
      valid: false,
      attributes: {
        season: null,
        name: '',
        presetFormat: null,
        numTeams: null,
        numTeamsPerGroup: null,
        numAdvancesFromGroup: null
      },
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
      presetFormats
    }),
    computed: {
      title () {
        if (this.close) {
          return 'Close Competition'
        } else if (this.record) {
          return 'Edit Competition'
        } else {
          return 'New Competition'
        }
      },
      competitions () {
        return [
          ...new Set(
            this.$store.$db().model('Competition')
              .query()
              .where('teamId', this.team.id)
              .get()
              .map(c => c.name)
          )
        ]
      },
      lastStage () {
        return this.$store.$db().model('Stage')
          .query()
          .where('competitionId', this.record.id)
          .orderBy('id')
          .last()
      },
      championOptions () {
        if (this.lastStage) {
          if (this.lastStage.table) {
            return this.$store.$db().model('TableRow')
              .query()
              .whereHas('stage', query => {
                query
                  .where('competitionId', this.record.id)
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
            return this.$store.$db().model('Fixture')
              .query()
              .where('stageId', this.lastStage.id)
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
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.attributes = pick(this.record, [
            'name',
            'champion',
            'season'
          ])
        } else {
          this.attributes.season = this.season
        }
      }
    },
    methods: {
      ...mapActions('competitions', {
        fetchCompetitions: 'fetch',
        createCompetition: 'create',
        updateCompetition: 'update'
      }),
      async submit () {
        if (this.record) {
          await this.updateCompetition({
            id: this.record.id,
            attributes: this.attributes
          })
        } else {
          const { id: competitionId } = await this.createCompetition({
            teamId: this.team.id,
            attributes: this.attributes
          })
          this.$router.push({
            name: 'competition',
            query: {
              teamId: this.team.id,
              competitionId
            }
          })
        }
      }
    }
  }
</script>
