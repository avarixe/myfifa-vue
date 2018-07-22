<template>
  <div class="d-inline-block" @click="inForm = true">
    <slot></slot>
    <v-dialog
      v-model="inForm"
      persistent
      lazy
      max-width="500px">
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
                  <v-text-field
                    v-model="team.title"
                    :rules="$_validate('Team', ['required'])"
                    label="Team"
                    prepend-inner-icon="people"
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
                      prepend-inner-icon="calendar_today"
                      v-model="team.start_date"
                      :rules="$_validate('Start Date', ['required', 'date'])"
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
                    :rules="$_validate('Currency', ['required'])"
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
            <v-btn
              flat
              large
              @click="inForm = false"
            >Cancel</v-btn>
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
  import { mapActions } from 'vuex'
  import FormBase from '@/mixins/FormBase'

  export default {
    mixins: [ FormBase ],
    props: {
      initialTeam: {
        type: Object
      }
    },
    data () {
      return {
        valid: !!this.initialTeam,
        team: Object.assign({
          id: '',
          title: '',
          start_date: this.$_format(new Date()),
          currency: '$'
        }, this.initialTeam),
        menu: false
      }
    },
    computed: {
      title () {
        return this.initialTeam ? 'Edit ' + this.team.title : 'New Team'
      }
    },
    methods: {
      ...mapActions('team', [
        'create',
        'update'
      ]),
      async submit () {
        if (this.$refs.form.validate()) {
          const save = this.id ? this.update : this.create
          try {
            await save(this.team)
            this.inForm = false
          } catch (e) {
            this.errorMessage = e.message
          }
        }
      }
    }
  }
</script>
