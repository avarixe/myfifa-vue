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
          | Match
    template(#form)
      dynamic-fields(:object="match" :fields="fields")
        template(#field.extra_time)
          v-checkbox(
            v-model="match.extra_time"
            label="Extra Time Required"
            hide-details
          )
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { parseISO } from 'date-fns'
  import { Competition } from '@/models'
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
    @matches.State teamOptions
    @matches.Action('FETCH_TEAM_OPTIONS') fetchTeamOptions
    @matches.Action('CREATE') createMatch
    @matches.Action('UPDATE') updateMatch
    @stages.Action('FETCH') fetchStages
    @Prop(Object) record

    valid = false
    loadingTeams = false
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
          items: this.teamOptions,
          label: 'Home Team',
          prependIcon: 'mdi-home',
          appendOuterIcon: `mdi-shield-${this.isHome ? 'star' : 'outline'}`,
          clickAppendOuter: this.setHome,
          required: true,
          loading: this.loadingTeams,
          spellcheck: 'false',
          autocapitalize: 'words',
          autocomplete: 'off',
          autocorrect: 'off'
        },
        {
          type: 'combobox',
          attribute: 'away',
          items: this.teamOptions,
          label: 'Away Team',
          prependIcon: 'mdi-bus',
          appendOuterIcon: `mdi-shield-${this.isAway ? 'star' : 'outline'}`,
          clickAppendOuter: this.setAway,
          loading: this.loadingTeams,
          required: true,
          spellcheck: 'false',
          autocapitalize: 'words',
          autocomplete: 'off',
          autocorrect: 'off'
        },
        { slot: 'extra_time' }
      ]
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

        this.loadTeamOptions()

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

    async loadTeamOptions () {
      try {
        this.loadingTeams = true
        await this.fetchTeamOptions({ teamId: this.team.id })
      } catch (e) {
        alert(e.message)
      } finally {
        this.loadingTeams = false
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
