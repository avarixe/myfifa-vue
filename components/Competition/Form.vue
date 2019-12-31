<template lang="pug">
  dialog-form(
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color"
  )
    template(#activator="{ on }")
      slot(:on="on")
        v-btn(v-on="on")
          v-icon(left) mdi-plus-circle-outline
          | Competition
    template(#form)
      dynamic-fields(:object="competition" :fields="fields")
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { Competition } from '@/models'
  import { TeamAccessible, DialogFormable } from '@/mixins'

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
      record: {
        type: Object,
        default: null
      },
      close: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      valid: false,
      loadingCompetitions: false,
      competition: {
        season: null,
        preset_format: null,
        num_teams: null,
        num_teams_per_group: null,
        num_advances_from_group: null
      }
    }),
    computed: {
      fields () {
        if (this.close) {
          return [
            {
              type: 'select',
              attribute: 'champion',
              items: this.record.teamOptions,
              label: 'Champion',
              prependIcon: 'mdi-crown',
              required: true
            }
          ]
        } else {
          let fields = [
            {
              type: 'string',
              value: this.seasonLabel(this.season),
              label: 'Season',
              prependIcon: 'mdi-calendar-text',
              disabled: true
            },
            {
              type: 'combobox',
              attribute: 'name',
              items: this.competitions,
              label: 'Name',
              prependIcon: 'mdi-trophy',
              required: true,
              loading: this.loadingCompetitions,
              spellcheck: 'false',
              autocapitalize: 'words',
              autocomplete: 'off',
              autocorrect: 'off'
            }
          ]

          if (!this.record) {
            fields = [
              ...fields,
              {
                type: 'select',
                attribute: 'preset_format',
                items: presetFormats,
                label: 'Preset Format',
                prependIcon: 'mdi-cogs',
                clearable: true
              },
              {
                type: 'string',
                attribute: 'num_teams',
                label: 'Number of Teams',
                prependIcon: 'mdi-account-group',
                inputmode: 'numeric',
                hidden: !this.competition.preset_format
              },
              {
                type: 'string',
                attribute: 'num_teams_per_group',
                label: 'Teams per Group',
                prependIcon: 'mdi-table',
                inputmode: 'numeric',
                required: true,
                hidden: this.isNotGroupAndKnockout
              },
              {
                type: 'string',
                attribute: 'num_advances_from_group',
                label: 'Teams Advance per Group',
                prependIcon: 'mdi-tournament',
                inputmode: 'numeric',
                required: true,
                hidden: this.isNotGroupAndKnockout
              }
            ]
          }

          return fields
        }
      },
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
      isNotGroupAndKnockout () {
        return this.competition.preset_format !== 'Group + Knockout'
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
        fetchCompetitions: 'FETCH',
        createCompetition: 'CREATE',
        updateCompetition: 'UPDATE'
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
  }
</script>
