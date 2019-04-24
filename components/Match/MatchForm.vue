<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>

    <v-container slot="form">
      <v-layout wrap>
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
            <v-tooltip
              slot="append"
              bottom
            >
              <v-icon
                slot="activator"
                @click.stop="setHome"
              >mdi-arrow-left</v-icon>
              Home Match for {{ team.title }}
            </v-tooltip>
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
            <v-tooltip
              slot="append"
              bottom
            >
              <v-icon
                slot="activator"
                @click.stop="setAway"
              >mdi-arrow-left</v-icon>
              Away Match for {{ team.title }}
            </v-tooltip>
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
      match: {
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
      matchData: {
        immediate: true,
        handler (val) {
          this.valid = !!val
          if (val) {
            Object.assign(this.match, this.$_pick(val, [
              'id', 'competition', 'home', 'away', 'extra_time'
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
