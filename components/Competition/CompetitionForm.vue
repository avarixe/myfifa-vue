<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
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
          v-model="competition.champion"
          label="Champion"
          prepend-icon="mdi-crown"
          :items="record.teamOptions"
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
          <v-combobox
            v-model="competition.name"
            label="Name"
            prepend-icon="mdi-trophy"
            :items="competitions"
            :rules="rulesFor.name"
            :loading="loadingCompetitions"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          />
        </v-col>
        <template v-if="!record">
          <v-col cols="12">
            <v-select
              v-model="competition.preset_format"
              label="Preset Format"
              prepend-icon="mdi-cogs"
              :items="presetFormats"
              clearable
            />
          </v-col>
          <v-scroll-y-transition mode="out-in">
            <v-col
              v-if="competition.preset_format"
              cols="12"
            >
              <v-text-field
                v-model="competition.num_teams"
                label="Number of Teams"
                prepend-icon="mdi-account-group"
                :rules="rulesFor.num_teams"
                inputmode="numeric"
              />
            </v-col>
          </v-scroll-y-transition>
          <v-scroll-y-transition mode="out-in">
            <v-row
              v-if="competition.preset_format === 'Group + Knockout'"
              dense
            >
              <v-col cols="12">
                <v-text-field
                  v-model="competition.num_teams_per_group"
                  label="Teams per Group"
                  prepend-icon="mdi-table"
                  :rules="rulesFor.num_teams_per_group"
                  inputmode="numeric"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="competition.num_advances_from_group"
                  label="Teams Advance per Group"
                  prepend-icon="mdi-tournament"
                  :rules="rulesFor.num_advances_from_group"
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
  import { Competition } from '@/models'
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
      loadingCompetitions: false,
      competition: {
        season: null,
        name: '',
        preset_format: null,
        num_teams: null,
        num_teams_per_group: null,
        num_advances_from_group: null
      },
      rulesFor: {
        name: [isRequired('Name')],
        num_teams: [
          isRequired('Number of Teams'),
          isNumber('Number of Teams')
        ],
        num_teams_per_group: [
          isRequired('Teams per Group'),
          isNumber('Teams per Group')
        ],
        num_advances_from_group: [
          isRequired('Teams Advance per Group'),
          isNumber('Teams Advance per Group')
        ],
        champion: [isRequired('Champion')]
      }
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
            Competition
              .query()
              .where('team_id', this.team.id)
              .get()
              .map(c => c.name)
          )
        ]
      },
      presetFormats () {
        return presetFormats
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.competition = pick(this.record, [
            'id',
            'name',
            'champion',
            'season'
          ])
        } else {
          this.competition.season = this.season
        }

        if (this.competitions.length === 0) {
          this.loadCompetitions()
        }
      }
    },
    methods: {
      ...mapActions('competitions', {
        fetchCompetitions: 'fetch',
        createCompetition: 'create',
        updateCompetition: 'update'
      }),
      async loadCompetitions () {
        try {
          this.loadingCompetitions = true
          await this.fetchCompetitions({ teamId: this.team.id })
        } catch (e) {
          alert(e.message)
        } finally {
          this.loadingCompetitions = false
        }
      },
      async submit () {
        if (this.record) {
          await this.updateCompetition(this.competition)
        } else {
          const { id: competitionId } = await this.createCompetition({
            teamId: this.team.id,
            competition: this.competition
          })
          this.$router.push({
            name: 'teams-teamId-competitions-competitionId',
            params: {
              teamId: this.team.id,
              competitionId
            }
          })
        }
      }
    }
  }
</script>
