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
          Match
        </v-btn>
      </slot>
    </template>

    <template #form>
      <dynamic-fields
        :object="match"
        :fields="fields"
      />
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { parseISO } from 'date-fns'
  import { Competition } from '@/models'
  import { teams } from '@/models/Match'
  import { DynamicFields } from '@/helpers'
  import { TeamAccessible, DialogFormable } from '@/mixins'

  const competitions = namespace('competitions')
  const matches = namespace('matches')
  const stages = namespace('stages')

  @Component({
    components: {
      DynamicFields
    }
  })
  export default class MatchForm extends mixins(DialogFormable, TeamAccessible) {
    @competitions.Action('FETCH') fetchCompetitions
    @matches.Action('CREATE') createMatch
    @matches.Action('UPDATE') updateMatch
    @stages.Action('FETCH') fetchStages
    @Prop(Object) record

    valid = false
    loadingCompetitions = false
    loadingStages = false
    match = {
      played_on: null,
      competition: '',
      home: '',
      away: '',
      extra_time: false
    }

    get fields () {
      return [
        {
          type: 'date',
          attribute: 'played_on',
          label: 'Date Played',
          prependIcon: 'mdi-calendar-today',
          required: true,
          color: this.color,
          min: this.record ? null : this.team.currently_on
        },
        {
          type: 'select',
          attribute: 'competition',
          items: this.competitions,
          label: 'Competition',
          prependIcon: 'mdi-trophy',
          required: true,
          loading: this.loadingCompetitions
        },
        {
          type: 'combobox',
          attribute: 'stage',
          items: this.stages,
          label: 'Stage',
          prependIcon: 'mdi-tournament',
          loading: this.loadingStages,
          hidden: !this.match.competition ||
                  this.match.competition.length === 0,
          spellcheck: 'false',
          autocapitalize: 'words',
          autocomplete: 'off',
          autocorrect: 'off'
        },
        {
          type: 'combobox',
          attribute: 'home',
          items: this.teams,
          label: 'Home Team',
          prependIcon: 'mdi-home',
          appendOuterIcon: `mdi-shield-${this.isHome ? 'star' : 'outline'}`,
          clickAppendOuter: this.setHome,
          required: true,
          spellcheck: 'false',
          autocapitalize: 'words',
          autocomplete: 'off',
          autocorrect: 'off'
        },
        {
          type: 'combobox',
          attribute: 'away',
          items: this.teams,
          label: 'Away Team',
          prependIcon: 'mdi-bus',
          appendOuterIcon: `mdi-shield-${this.isAway ? 'star' : 'outline'}`,
          clickAppendOuter: this.setAway,
          required: true,
          spellcheck: 'false',
          autocapitalize: 'words',
          autocomplete: 'off',
          autocorrect: 'off'
        },
        {
          type: 'checkbox',
          attribute: 'extra_time',
          label: 'Extra Time Required'
        }
      ]
    }

    get teams () {
      return teams(this.team.id)
    }

    get title () {
      return this.record ? 'Edit Match' : 'New Match'
    }

    get isHome () {
      return this.match.home === this.team.title
    }

    get isAway () {
      return this.match.away === this.team.title
    }

    get season () {
      const startDate = parseISO(this.team.started_on)
      const datePlayed = parseISO(this.match.played_on)
      return parseInt((datePlayed - startDate) / (525600 * 60 * 1000))
    }

    get competitions () {
      return Competition
        .query()
        .where('season', this.season)
        .where(comp => this.match.competition === comp.name || !comp.champion)
        .get()
        .map(competition => competition.name)
    }

    get competitionId () {
      if (this.match.competition) {
        const competition = Competition
          .query()
          .where('season', this.season)
          .where('name', this.match.competition)
          .first()
        return competition ? competition.id : null
      }
      return null
    }

    get stages () {
      const competition = Competition
        .query()
        .with('stages')
        .where('season', this.season)
        .where('name', this.match.competition)
        .first()

      if (competition) {
        return competition.stages
          .filter(stage => !stage.table)
          .map(stage => stage.name)
      } else {
        return []
      }
    }

    @Watch('dialog')
    setMatch (val) {
      if (val) {
        if (this.record) {
          this.match = pick(this.record, [
            'id',
            'played_on',
            'competition',
            'stage',
            'home',
            'away',
            'extra_time'
          ])
        } else {
          this.match.played_on = this.team.currently_on
        }

        if (this.competitions.length === 0) {
          this.loadCompetitions()
        }
      }
    }

    @Watch('competitionId', { immediate: true })
    async loadStages (competitionId) {
      if (competitionId) {
        try {
          this.loadingStages = true
          await this.fetchStages({ competitionId })
        } catch (e) {
          alert(e.message)
        } finally {
          this.loadingStages = false
        }
      }
    }

    setHome () {
      this.match.home = this.team.title
      if (this.match.away === this.team.title) {
        this.match.away = ''
      }
    }

    setAway () {
      this.match.away = this.team.title
      if (this.match.home === this.team.title) {
        this.match.home = ''
      }
    }

    async loadCompetitions () {
      try {
        this.loadingCompetitions = true
        await this.fetchCompetitions({ teamId: this.team.id })
      } catch (e) {
        alert(e.message)
      } finally {
        this.loadingCompetitions = false
      }
    }

    async submit () {
      if (this.record) {
        await this.updateMatch(this.match)
      } else {
        const { data } = await this.createMatch({
          teamId: this.team.id,
          match: this.match
        })
        this.$router.push({
          name: 'teams-teamId-matches-matchId',
          params: {
            teamId: this.team.id,
            matchId: data.id
          }
        })
      }
    }
  }
</script>
