<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color">
    <slot slot="activator"></slot>
    <v-container slot="form">
      <v-layout wrap>
        <v-flex xs12>
          <v-combobox
            v-model="match.competition"
            :items="competitions"
            :rules="$_validate('Competition', ['required'])"
            label="Competition"
            prepend-icon="whatshot"
          ></v-combobox>
        </v-flex>
        <v-flex xs12>
          <v-combobox
            v-model="match.home"
            :items="teams"
            :rules="$_validate('Home Team', ['required'])"
            label="Home Team"
            prepend-icon="people">
            <v-tooltip slot="append" bottom>
              <v-icon slot="activator" @click.stop="setHome">arrow_back</v-icon>
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
            prepend-icon="people">
            <v-tooltip slot="append" bottom>
              <v-icon slot="activator" @click.stop="setAway">arrow_back</v-icon>
              Away Match for {{ team.title }}
            </v-tooltip>
          </v-combobox>
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import TeamAction from '@/mixins/TeamAction'
  import FormBase from '@/mixins/FormBase'

  export default {
    mixins: [
      FormBase,
      TeamAction
    ],
    props: {
      initialMatch: {
        type: Object
      }
    },
    data () {
      return {
        valid: !!this.initialMatch,
        match: Object.assign({
          competition: '',
          home: '',
          away: ''
        }, this.initialMatch)
      }
    },
    computed: {
      ...mapGetters('match', [
        'competitions',
        'teams'
      ]),
      title () {
        return this.match.id ? 'Edit Match' : 'New Match'
      },
      isTeamGame () {
        return this.match.home === this.team.title ||
               this.match.away === this.team.title
      }
    },
    methods: {
      ...mapActions('match', [
        'create',
        'update'
      ]),
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
        if (this.initialMatch) {
          await this.update(this.match)
        } else {
          await this.create({
            teamId: this.team.id,
            match: this.match
          })
        }
      }
    }
  }
</script>