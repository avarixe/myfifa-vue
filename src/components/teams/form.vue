<template>
  <div class="d-inline-block" @click="open">
    <slot></slot>
    <v-dialog v-model="inForm" scrollable max-width="500px">
      <v-form v-model="valid" @submit.prevent="id ? updateTeam() : createTeam()">
        <v-card>
          <v-card-title primary-title>
            <div class="headline">{{ title }}</div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="team.title"
                    label="Team"
                    autofocus
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    v-model="menu"
                    :return-value.sync="team.start_date"
                    lazy
                    transition="scale-transition"
                    full-width>
                    <v-text-field
                      slot="activator"
                      label="Start Date"
                      v-model="team.start_date"
                      readonly
                    ></v-text-field>
                    <v-date-picker
                      v-model="team.start_date"
                      landscape
                      @input="$refs.menu.save(team.start_date)"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="team.currency"
                    label="Currency"
                    required
                    auto-grow
                  ></v-text-field>
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
            <v-btn type="submit" :disabled="!valid" flat large>Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { format } from 'date-fns'

  export default {
    props: [
      'id',
      'title'
    ],
    data () {
      return {
        inForm: false,
        valid: false,
        errorMessage: '',
        team: {
          id: '',
          title: '',
          start_date: format(new Date(), 'YYYY-MM-DD'),
          currency: '$'
        },
        menu: false
      }
    },
    computed: {
      formError: {
        get: function () { return this.errorMessage.length > 0 },
        set: function (val) { this.errorMessage = val }
      }
    },
    methods: {
      ...mapActions('team', [
        'get',
        'create',
        'update'
      ]),
      open () {
        this.inForm = true

        if (this.id) {
          this.get({ teamId: this.id })
            .then((data) => {
              this.team = {
                start_date: data.start_date,
                title: data.title,
                id: data.id,
                currency: data.currency
              }
            })
            .catch((error) => {
              this.errorMessage = error.message
            })
        }
      },
      close () {
        this.inForm = false
        this.errorMessage = ''
        this.player = {
          id: '',
          title: '',
          start_date: format(new Date(), 'YYYY-MM-DD'),
          currency: '$'
        }
      },
      createTeam () {
        this.create(this.team)
          .then((data) => { this.inForm = false })
          .catch((error) => { this.errorMessage = error.message })
      },
      updateTeam () {
        this.update(this.team)
          .then((data) => { this.inForm = false })
          .catch((error) => { this.errorMessage = error.message })
      }
    }
  }
</script>