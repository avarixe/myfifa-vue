<template>
  <div class="d-inline-block" @click="open">
    <slot></slot>
    <v-dialog v-model="inForm" max-width="500px">
      <v-form v-model="valid" @submit.prevent="team.id ? updateTeam() : createTeam()">
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
                    v-model="formError"
                    dismissible>
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
  import { mapActions } from 'vuex'
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
        errorMessage: '',
        team: {
          id: '',
          title: '',
          current_date: format(new Date(), 'YYYY-MM-DD')
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
      ...mapActions({
        get: 'team/get',
        create: 'team/create',
        update: 'team/update'
      }),
      open () {
        this.inForm = true

        if (this.teamId) {
          this.get({ teamId: this.teamId })
            .then((data) => {
              this.team = {
                current_date: data.current_date,
                title: data.title,
                id: data.id
              }
            })
            .catch((error) => {
              this.errorMessage = error.message
            })
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