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
        <v-select
          v-model="competition.champion"
          :items="teams"
          label="Champion"
          prepend-icon="mdi-crown"
          :rules="$_validate('Champion', ['required'])"
        />
      </v-col>
      <template v-else>
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
            :items="competitions"
            :rules="$_validate('Name', ['required'])"
            label="Name"
            prepend-icon="mdi-trophy"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          />
        </v-col>
        <template v-if="!competitionData">
          <v-col cols="12">
            <v-select
              v-model="competition.preset_format"
              :items="presetFormats"
              label="Preset Format"
              prepend-icon="mdi-cogs"
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
                :rules="$_validate('Number of Teams', ['required'])"
                label="Number of Teams"
                prepend-icon="mdi-account-multiple"
                type="number"
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
                  :rules="$_validate('Teams per Group', ['required'])"
                  label="Teams per Group"
                  prepend-icon="mdi-account-group"
                  type="number"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="competition.num_advances_from_group"
                  :rules="$_validate('Teams Advancing per Group', ['required'])"
                  label="Teams Advance per Group"
                  prepend-icon="mdi-forward"
                  type="number"
                />
              </v-col>
            </v-row>
          </v-scroll-y-transition>
        </template>
      </template>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { Competition } from '@/models'
  import { TeamAccessible, DialogFormable } from '@/mixins'

  const mix = mixins(DialogFormable, TeamAccessible)
  const competitions = namespace('competitions')

  @Component
  export default class CompetitionForm extends mix {
    @competitions.Action('CREATE') createCompetition
    @competitions.Action('UPDATE') updateCompetition
    @Prop(Object) competitionData
    @Prop(Boolean) close

    valid = false
    presetFormats = [
      'League',
      'Knockout',
      'Group + Knockout'
    ]
    competition = {
      season: null,
      preset_format: null,
      num_teams: null,
      num_teams_per_group: null,
      num_advances_from_group: null
    }

    get title () {
      if (this.close) {
        return 'Close Competition'
      } else if (this.competitionData) {
        return 'Edit Competition'
      } else {
        return 'New Competition'
      }
    }

    get competitions () {
      return [
        ...new Set(
          Competition
            .query()
            .where('team_id', this.team.id)
            .get()
            .map(c => c.name)
        )
      ]
    }

    get teams () {
      return this.competitionData.teamOptions
    }

    @Watch('dialog')
    setCompetition (val) {
      if (val && this.competitionData) {
        this.competition = pick(this.competitionData, [
          'id',
          'name',
          'champion',
          'season'
        ])
      } else {
        this.competition.season = this.season
      }
    }

    async submit () {
      if (this.competitionData) {
        await this.updateCompetition(this.competition)
      } else {
        const { data } = await this.createCompetition({
          teamId: this.team.id,
          competition: this.competition
        })
        this.$router.push({
          name: 'teams-teamId-competitions-competitionId',
          params: {
            teamId: this.team.id,
            competitionId: data.id
          }
        })
      }
    }
  }
</script>
