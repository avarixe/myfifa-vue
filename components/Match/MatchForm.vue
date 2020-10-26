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
  import { mapState, mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { parseISO } from 'date-fns'
  import { Competition } from '@/models'
  import { TeamAccessible, DialogFormable } from '@/mixins'

  export default {
    name: 'MatchForm',
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      record: { type: Object, default: null }
    },
    data: () => ({
      valid: false,
      loadingTeams: false,
      loadingCompetitions: false,
      loadingStages: false,
      match: {
        played_on: null,
        competition: '',
        home: '',
        away: '',
        extra_time: false
      }
    }),
    computed: {
      ...mapState('matches', [
        'teamOptions'
      ]),
      fields () {
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
          {
            type: 'checkbox',
            attribute: 'extra_time',
            label: 'Extra Time Required',
            hideDetails: true
          }
        ]
      },
      title () {
        return this.record ? 'Edit Match' : 'New Match'
      },
      isHome () {
        return this.match.home === this.team.title
      },
      isAway () {
        return this.match.away === this.team.title
      },
      season () {
        const startDate = parseISO(this.team.started_on)
        const datePlayed = parseISO(this.match.played_on)
        return parseInt((datePlayed - startDate) / (525600 * 60 * 1000))
      },
      competitions () {
        return Competition
          .query()
          .where('team_id', this.team.id)
          .where('season', this.season)
          .where(comp => this.match.competition === comp.name || !comp.champion)
          .get()
          .map(competition => competition.name)
      },
      competitionId () {
        if (this.match.competition) {
          const competition = Competition
            .query()
            .where('team_id', this.team.id)
            .where('season', this.season)
            .where('name', this.match.competition)
            .first()
          return competition ? competition.id : null
        }
        return null
      },
      stages () {
        const competition = Competition
          .query()
          .with('stages')
          .where('team_id', this.team.id)
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
    },
    watch: {
      dialog (val) {
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
      },
      competitionId: {
        async handler (competitionId) {
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
        },
        immediate: true
      }
    },
    methods: {
      ...mapActions({
        fetchTeamOptions: 'matches/FETCH_TEAM_OPTIONS',
        createMatch: 'matches/CREATE',
        updateMatch: 'matches/UPDATE',
        fetchCompetitions: 'competitions/FETCH',
        fetchStages: 'stages/FETCH'
      }),
      setHome () {
        this.match.home = this.team.title
        if (this.match.away === this.team.title) {
          this.match.away = ''
        }
      },
      setAway () {
        this.match.away = this.team.title
        if (this.match.home === this.team.title) {
          this.match.home = ''
        }
      },
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
      async loadTeamOptions () {
        try {
          this.loadingTeams = true
          await this.fetchTeamOptions({ teamId: this.team.id })
        } catch (e) {
          alert(e.message)
        } finally {
          this.loadingTeams = false
        }
      },
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
  }
</script>
