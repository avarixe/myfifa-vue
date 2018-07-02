<template>
  <div class="d-inline-block" @click="inForm = true">
    <slot></slot>
    <v-dialog v-model="inForm" max-width="500px">
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-card>
          <v-card-title primary-title :class="formColor">
            <div class="headline">{{ title }}</div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-combobox
                    v-model="match.competition"
                    :items="competitions"
                    :rules="$validate('Competition', ['required'])"
                    label="Competition"
                    prepend-icon="whatshot"
                  ></v-combobox>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="match.home"
                    :rules="$validate('Home Team', ['required'])"
                    label="Home Team"
                    prepend-icon="people">
                    <v-tooltip slot="append" bottom>
                      <v-icon slot="activator" @click="setHome">arrow_back</v-icon>
                      <span>Home Match for {{ team.title }}</span>
                    </v-tooltip>
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="match.away"
                    :rules="$validate('Away Team', ['required'])"
                    label="Away Team"
                    prepend-icon="people">
                    <v-tooltip slot="append" bottom>
                      <v-icon slot="activator" @click="setAway">arrow_back</v-icon>
                      <span>Away Match for {{ team.title }}</span>
                    </v-tooltip>
                  </v-text-field>
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

  export default {
    props: [
      'initialMatch',
      'teamId',
      'color'
    ],
    data () {
      return {
        inForm: false,
        valid: !!this.initialMatch,
        errorMessage: '',
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
        'competitions'
      ]),
      formError: {
        get: function () { return this.errorMessage.length > 0 },
        set: function (val) { this.errorMessage = val }
      },
      title () {
        return this.match.id ? 'Edit Match' : 'New Match'
      },
      buttonColor () {
        return this.color ? this.color + ' darken-2' : null
      },
      formColor () {
        return this.color ? this.color + ' accent-2' : null
      }
    },
    watch: {
      inForm (val) {
        if (!val) {
          Object.assign(this.$data, this.$options.data.apply(this))
          // this.$refs.form.reset()
        }
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
