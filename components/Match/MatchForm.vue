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
          outlined
          color="blue-grey"
        >
          <v-icon left>mdi-plus-circle-outline</v-icon>
          Match
        </v-btn>
      </slot>
    </template>

    <template #form>
      <v-container>
        <v-layout wrap>
          <v-flex xs12>
            <v-menu
              v-model="menu"
              ref="menu"
              :close-on-content-click="false"
              :return-value.sync="match.date_played"
              transition="scale-transition"
              full-width
              min-width="290px"
            >
              <template #activator="{ on }">
                <v-text-field
                  v-model="match.date_played"
                  v-on="on"
                  label="Date Played"
                  prepend-icon="mdi-calendar-today"
                  :rules="$_validate('Date Played', ['required', 'date'])"
                  readonly
                />
              </template>
              <v-date-picker
                v-model="match.date_played"
                ref="picker"
                :color="color"
                @input="$refs.menu.save(match.date_played)"
              />
            </v-menu>
          </v-flex>
          <v-flex xs12>
            <v-combobox
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
          </v-flex>
          <v-flex xs12>
            <v-combobox
              v-model="match.home"
              :items="teams"
              :rules="$_validate('Home Team', ['required'])"
              label="Home Team"
              prepend-icon="mdi-account-multiple"
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
                    >mdi-arrow-left</v-icon>
                  </template>
                  Home Match for {{ team.title }}
                </v-tooltip>
              </template>
            </v-combobox>
          </v-flex>
          <v-flex xs12>
            <v-combobox
              v-model="match.away"
              :items="teams"
              :rules="$_validate('Away Team', ['required'])"
              label="Away Team"
              prepend-icon="mdi-account-multiple"
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
                    >mdi-arrow-left</v-icon>
                  </template>
                  Away Match for {{ team.title }}
                </v-tooltip>
              </template>
            </v-combobox>
          </v-flex>
          <v-flex xs12>
            <v-checkbox
              v-model="match.extra_time"
              label="Extra Time Required"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import {
    competitions,
    teams
  } from '@/models/Match'
  import {
    TeamAccessible,
    DialogFormable
  } from '@/mixins'

  export default {
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      matchData: {
        type: Object,
        default: () => ({})
      }
    },
    data: () => ({
      valid: false,
      menu: false,
      match: {
        date_played: null,
        competition: '',
        home: '',
        away: '',
        extra_time: false
      }
    }),
    computed: {
      teams () { return teams(this.team.id) },
      competitions () { return competitions(this.team.id) },
      title () {
        return this.match.id ? 'Edit Match' : 'New Match'
      },
      isTeamGame () {
        return this.match.home === this.team.title ||
               this.match.away === this.team.title
      }
    },
    watch: {
      dialog (val) {
        if (val) {
          if (!this.match.date_played) {
            this.match.date_played = this.team.current_date
          }
        } else {
          Object.assign(this.$data, this.$options.data.apply(this))
          // this.$refs.form.reset()
        }
      },
      matchData: {
        immediate: true,
        handler (val) {
          this.valid = !!val
          if (val) {
            Object.assign(this.match, this.$_pick(val, [
              'id',
              'date_played',
              'competition',
              'home',
              'away',
              'extra_time'
            ]))
          }
        }
      }
    },
    methods: {
      ...mapActions('matches', {
        create: 'CREATE',
        update: 'UPDATE'
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
  }
</script>
