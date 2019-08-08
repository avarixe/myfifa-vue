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
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-date-field
              v-model="match.played_on"
              label="Date Played"
              prepend-icon="mdi-calendar-today"
              :min="match.id ? null : team.currently_on"
              :color="color"
              required
            />
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="match.competition"
              :items="competitions"
              :rules="$_validate('Competition', ['required'])"
              label="Competition"
              prepend-icon="mdi-trophy"
              spellcheck="false"
              autocapitalize="words"
              autocomplete="off"
              autocorrect="off"
            />
          </v-col>
          <v-scroll-y-transition mode="out-in">
            <v-col
              v-if="stages.length > 0"
              cols="12"
            >
              <v-select
                v-model="match.stage"
                :items="stages"
                label="Stage"
                prepend-icon="mdi-trophy"
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
              :items="teams"
              :rules="$_validate('Home Team', ['required'])"
              label="Home Team"
              prepend-icon="mdi-shield-half-full"
              spellcheck="false"
              autocapitalize="words"
              autocomplete="off"
              autocorrect="off"
            >
              <template #append>
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <v-icon
                      v-on="on"
                      @click.stop="setHome"
                    >
                      mdi-arrow-left
                    </v-icon>
                  </template>
                  Home Match for {{ team.title }}
                </v-tooltip>
              </template>
            </v-combobox>
          </v-col>
          <v-col cols="12">
            <v-combobox
              v-model="match.away"
              :items="teams"
              :rules="$_validate('Away Team', ['required'])"
              label="Away Team"
              prepend-icon="mdi-shield-half-full"
              spellcheck="false"
              autocapitalize="words"
              autocomplete="off"
              autocorrect="off"
            >
              <template #append>
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <v-icon
                      v-on="on"
                      @click.stop="setAway"
                    >
                      mdi-arrow-left
                    </v-icon>
                  </template>
                  Away Match for {{ team.title }}
                </v-tooltip>
              </template>
            </v-combobox>
          </v-col>
          <v-col cols="12">
            <v-checkbox
              v-model="match.extra_time"
              label="Extra Time Required"
            />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { mapActions } from 'vuex'
  import { Competition } from '@/models'
  import { teams } from '@/models/Match'
  import { VDateField } from '@/helpers'
  import { TeamAccessible, DialogFormable } from '@/mixins'

  @Component({
    components: {
      VDateField
    },
    methods: mapActions('matches', {
      create: 'CREATE',
      update: 'UPDATE'
    })
  })
  export default class MatchForm extends mixins(DialogFormable, TeamAccessible) {
    @Prop(Object) matchData

    valid = false
    match = {
      played_on: null,
      competition: '',
      home: '',
      away: '',
      extra_time: false
    }

    get teams () {
      return teams(this.team.id)
    }

    get title () {
      return this.match.id ? 'Edit Match' : 'New Match'
    }

    get isTeamGame () {
      return this.match.home === this.team.title ||
             this.match.away === this.team.title
    }

    get season () {
      const startDate = this.$_parse(this.team.started_on)
      const datePlayed = this.$_parse(this.match.played_on)
      return parseInt((datePlayed - startDate) / (525600 * 60 * 1000))
    }

    get competitions () {
      return Competition
        .query()
        .where('season', this.season)
        .where('champion', null)
        .get()
        .map(competition => competition.name)
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
      if (val && this.matchData) {
        Object.assign(this.match, this.$_pick(this.matchData, [
          'id',
          'played_on',
          'competition',
          'stage',
          'home',
          'away',
          'extra_time'
        ]))
      } else {
        this.match.played_on = this.team.currently_on
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

    async submit () {
      if ('id' in this.match) {
        await this.update(this.match)
      } else {
        const { data } = await this.create({
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
