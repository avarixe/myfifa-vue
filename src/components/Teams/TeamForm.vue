<template>
  <div class="team-form" @click="openForm">
    <slot></slot>
    <v-dialog v-model="inForm" max-width="500px">
      <v-form v-model="valid" @submit.prevent="saveForm">
        <v-card>
          <v-card-title primary-title>
            <div class="headline">{{ formTitle }}</div>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-alert
                    type="error"
                    v-model="saveError"
                    dismissible
                  >
                    {{ errorMessage }}
                  </v-alert>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="team.title"
                    label="Team"
                    autofocus
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="team.current_date"
                    label="Current Date"
                    type="date"
                  ></v-text-field>                  
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
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
  import { format } from 'date-fns'

  export default {
    props: [
      'teamId',
      'formTitle'
    ],
    data () {
      return {
        inForm: false,
        valid: false,
        saveError: false,
        errorMessage: '',
        team: {
          title: '',
          current_date: format(new Date(), 'YYYY-MM-DD')
        },
        menu: false
      }
    },
    methods: {
      openForm () {
        this.inForm = true

        if (this.teamId) {
          this.$store.dispatch('team/getTeam', { teamId: this.teamId })
            .then((data) => {
              this.team = {
                current_date: data.current_date,
                title: data.title
              }
            })
            .catch((error) => {
              this.errorMessage = error.message
              this.loginError = true
            })
        }
      },
      saveForm () {
        this.$store.dispatch('team/saveTeam', this.team)
          .then((data) => {
            this.inForm = false
            this.$router.push('/teams')
          })
          .catch((error) => {
            this.errorMessage = error.message
            this.loginError = true
          })
      }
    }
  }
</script>