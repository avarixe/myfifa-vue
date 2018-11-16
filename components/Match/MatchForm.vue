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
            prepend-icon="mdi-trophy"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          ></v-combobox>
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
            autocorrect="off">
            <v-tooltip slot="append" bottom>
              <v-icon slot="activator" @click.stop="setHome">mdi-arrow-left</v-icon>
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
            autocorrect="off">
            <v-tooltip slot="append" bottom>
              <v-icon slot="activator" @click.stop="setAway">mdi-arrow-left</v-icon>
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
  import TeamAccessible from '@/mixins/TeamAccessible'
  import DialogFormable from '@/mixins/DialogFormable'

  export default {
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      initialMatch: Object
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
          const { data } = await this.create({
            teamId: this.team.id,
            match: this.match
          })
          this.$router.push({
          name: 'teams-id-matches-matchId',
            params: {
              id: this.team.id,
              matchId: data.id
            }
          })
        }
      }
    }
  }
</script>
