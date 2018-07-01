<template>
  <div class="d-inline-block" @click="inForm = true">
    <slot></slot>
    <v-dialog v-model="inForm" scrollable max-width="500px">
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
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
                    :rules="$validate('Team', ['required'])"
                    label="Team"
                    autofocus
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
                      :rules="$validate('Start Date', ['required', 'date'])"
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
                    :rules="$validate('Currency', ['required'])"
                    label="Currency"
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
      'initialTeam'
    ],
    data () {
      return {
        inForm: false,
        valid: !!this.initialTeam,
        errorMessage: '',
        team: Object.assign({
          id: '',
          title: '',
          start_date: format(new Date(), 'YYYY-MM-DD'),
          currency: '$'
        }, this.initialTeam),
        menu: false
      }
    },
    computed: {
      formError: {
        get: function () { return this.errorMessage.length > 0 },
        set: function (val) { this.errorMessage = val }
      },
      title () {
        return this.initialTeam ? 'Edit ' + this.team.title : 'New Team'
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
      ...mapActions('team', [
        'create',
        'update'
      ]),
      submit () {
        if (this.$refs.form.validate()) {
          const save = this.id ? this.update : this.create
          save(this.team)
            .then((data) => { this.inForm = false })
            .catch((error) => { this.errorMessage = error.message })
        }
      }
    }
  }
</script>