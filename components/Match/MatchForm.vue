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
      <v-col cols="12">
        <v-date-field
          v-model="match.played_on"
          label="Date Played"
          prepend-icon="mdi-calendar-today"
          required
          :color="color"
          :min="record ? null : team.currently_on"
        />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="match.competition"
          label="Competition"
          prepend-icon="mdi-trophy"
          :items="competitions"
          :rules="rulesFor.competition"
          :loading="loadingCompetitions"
        />
      </v-col>
      <v-scroll-y-transition mode="out-in">
        <v-col
          v-if="match.competition"
          cols="12"
        >
          <v-combobox
            v-model="match.stage"
            label="Stage"
            prepend-icon="mdi-tournament"
            :items="stages"
            :loading="loadingStages"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          />
        </v-col>
      </v-scroll-y-transition>
      <v-col cols="12">
        <v-combobox
          v-model="match.home"
          label="Home Team"
          prepend-icon="mdi-home"
          :items="teamOptions"
          :rules="rulesFor.home"
          :loading="loadingTeams"
          :append-outer-icon="`mdi-shield-${isHome ? 'star' : 'outline'}`"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
          @click:append-outer="setHome"
        />
      </v-col>
      <v-col cols="12">
        <v-combobox
          v-model="match.away"
          label="Away Team"
          prepend-icon="mdi-bus"
          :items="teamOptions"
          :rules="rulesFor.away"
          :loading="loadingTeams"
          :append-outer-icon="`mdi-shield-${isAway ? 'star' : 'outline'}`"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
          @click:append-outer="setAway"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="match.extra_time"
          label="Extra Time Required"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { parseISO } from 'date-fns'
  import { Competition } from '@/models'
  import { TeamAccessible, DialogFormable } from '@/mixins'
  import { isRequired } from '@/functions'

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
        stage: null,
        home: '',
        away: '',
        extra_time: false
      },
      rulesFor: {
        competition: [isRequired('Competition')],
        home: [isRequired('Home Team')],
        away: [isRequired('Away Team')]
      }
    }),
    computed: {
      ...mapState('matches', [
        'teamOptions'
      ]),
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
          const { id: matchId } = await this.createMatch({
            teamId: this.team.id,
            match: this.match
          })
          this.$router.push({
            name: 'teams-teamId-matches-matchId',
            params: {
              teamId: this.team.id,
              matchId
            }
          })
        }
      }
    }
  }
</script>
