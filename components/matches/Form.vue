<template>
  <div class="d-inline-block" @click.stop="inForm = true">
    <slot></slot>
    <v-dialog v-model="inForm" max-width="500px">
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-card>
          <v-card-title primary-title :class="formColor">
            <div class="headline">{{ title }}</div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-layout wrap>
                <v-flex xs12>
                  <v-combobox
                    v-model="match.competition"
                    :items="competitions"
                    :rules="$validate('Competition', ['required'])"
                    label="Competition"
                    prepend-inner-icon="whatshot"
                  ></v-combobox>
                </v-flex>
                <v-flex xs12>
                  <v-combobox
                    v-model="match.home"
                    :items="teams"
                    :rules="$validate('Home Team', ['required'])"
                    label="Home Team"
                    prepend-inner-icon="people">
                    <v-tooltip slot="append" bottom>
                      <v-icon slot="activator" @click="setHome">arrow_back</v-icon>
                      Home Match for {{ team.title }}
                    </v-tooltip>
                  </v-combobox>
                </v-flex>
                <v-flex xs12>
                  <v-combobox
                    v-model="match.away"
                    :items="teams"
                    :rules="$validate('Away Team', ['required'])"
                    label="Away Team"
                    prepend-inner-icon="people">
                    <v-tooltip slot="append" bottom>
                      <v-icon slot="activator" @click="setAway">arrow_back</v-icon>
                      Away Match for {{ team.title }}
                    </v-tooltip>
                  </v-combobox>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-alert
            type="error"
            v-model="formError"
            dismissible>
            {{ errorMessage }}
          </v-alert>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              type="submit"
              :disabled="!valid"
              :color="buttonColor"
              flat
              large
            >Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import FormMixin from '@/mixins/Form'

  export default {
    mixins: [ FormMixin ],
    props: [
      'initialMatch',
      'teamId',
      'color'
    ],
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
      ...mapState('team', {
        team: 'active'
      }),
      ...mapGetters('match', [
        'competitions',
        'teams'
      ]),
      title () {
        return this.match.id ? 'Edit Match' : 'New Match'
      },
      buttonColor () {
        return this.color ? this.color + ' darken-2' : null
      },
      formColor () {
        return this.color ? this.color + ' accent-2' : null
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
      submit () {
        if (this.$refs.form.validate()) {
          let params, save
          if (this.initialMatch) {
            params = this.match
            save = this.update
          } else {
            params = { teamId: this.teamId, match: this.match }
            save = this.create
          }

          save(params)
            .then((data) => { this.inForm = false })
            .catch((error) => { this.errorMessage = error.message })
        }
      }
    }
  }
</script>
