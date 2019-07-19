<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <v-btn
          v-on="on"
          color="blue-grey"
          outlined
        >
          <v-icon left>mdi-plus-circle-outline</v-icon>
          Competition
        </v-btn>
      </slot>
    </template>

    <template #form>
      <v-container grid-list-xs>
        <v-layout wrap>
          <template v-if="close">
            <v-flex xs12>
              <v-select
                v-model="competition.champion"
                :items="teams"
                label="Champion"
                prepend-icon="mdi-crown"
                :rules="$_validate('Champion', ['required'])"
              />
            </v-flex>
          </template>
          <template v-else>
            <v-flex xs12>
              <v-text-field
                :value="seasonLabel(season)"
                label="Season"
                prepend-icon="mdi-calendar-text"
                disabled
              />
            </v-flex>
            <v-flex xs12>
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
            </v-flex>
            <template v-if="!competitionData">
              <v-flex xs12>
                <v-select
                  v-model="competition.preset_format"
                  :items="presetFormats"
                  label="Preset Format"
                  prepend-icon="mdi-cogs"
                  clearable
                />
              </v-flex>
              <v-scroll-y-transition mode="out-in">
                <v-flex
                  v-if="competition.preset_format"
                  xs12
                >
                  <v-text-field
                    v-model="competition.num_teams"
                    :rules="$_validate('Number of Teams', ['required'])"
                    label="Number of Teams"
                    prepend-icon="mdi-account-multiple"
                    type="number"
                  />
                </v-flex>
              </v-scroll-y-transition>
              <v-scroll-y-transition mode="out-in">
                <v-flex
                  v-if="competition.preset_format === 'Group + Knockout'"
                  xs12
                >
                  <v-text-field
                    v-model="competition.num_teams_per_group"
                    :rules="$_validate('Teams per Group', ['required'])"
                    label="Teams per Group"
                    prepend-icon="mdi-account-group"
                    type="number"
                  />
                </v-flex>
              </v-scroll-y-transition>
              <v-scroll-y-transition mode="out-in">
                <v-flex
                  v-if="competition.preset_format === 'Group + Knockout'"
                  xs12
                >
                  <v-text-field
                    v-model="competition.num_advances_from_group"
                    :rules="$_validate('Teams Advancing per Group', ['required'])"
                    label="Teams Advance per Group"
                    prepend-icon="mdi-forward"
                    type="number"
                  />
                </v-flex>
              </v-scroll-y-transition>
              <v-scroll-y-transition mode="out-in">
                <v-text-field
                  v-if="competition.preset_format !== 'League'"
                  v-model="competition.num_matches_per_fixture"
                  :rules="$_validate('Matches per Fixture', ['required'])"
                  label="Matches per Fixture"
                  prepend-icon="mdi-sword-cross"
                  type="number"
                />
              </v-scroll-y-transition>
            </template>
          </template>
        </v-layout>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { mapActions } from 'vuex'
  import { Competition } from '@/models'
  import { TeamAccessible, DialogFormable } from '@/mixins'

  const mix = mixins(DialogFormable, TeamAccessible)

  @Component({
    methods: mapActions('competitions', {
      create: 'CREATE',
      update: 'UPDATE'
    })
  })
  export default class CompetitionForm extends mix {
    @Prop(Object) competitionData
    @Prop(Boolean) close

    valid = false
    presetFormats = [
      'League',
      'Knockout',
      'Group + Knockout'
    ]
    competition = {}

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
        this.competition = this.$_pick(this.competitionData, [
          'id',
          'name',
          'champion'
        ])
      } else {
        this.competition = {
          season: this.season,
          preset_format: null,
          num_teams: null,
          num_teams_per_group: null,
          num_advances_from_group: null,
          num_matches_per_fixture: null
        }
      }
    }

    async submit () {
      if (this.competitionData) {
        await this.update(this.competition)
      } else {
        const { data } = await this.create({
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
