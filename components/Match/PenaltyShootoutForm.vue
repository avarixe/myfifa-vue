<template>
  <div class="d-inline-block" @click.stop="inForm = true">
    <slot></slot>
    <v-dialog v-model="inForm" max-width="500px">
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-card>
          <v-card-title primary-title :class="formColor">
            <div class="headline">
              <v-icon left>accessibility_new</v-icon>
              Record Penalty Shootout
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-layout wrap>
                <v-flex xs6>
                  <v-text-field
                    v-model="penaltyShootout.home_score"
                    :rules="$_validate('Home Score', ['required'])"
                    type="number"
                    :label="match.home"
                    prepend-icon="filter_tilt_shift"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    v-model="penaltyShootout.away_score"
                    :rules="$_validate('Away Score', ['required'])"
                    type="number"
                    :label="match.away"
                    prepend-icon="filter_tilt_shift"
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
  import TeamAction from '@/mixins/TeamAction'
  import FormBase from '@/mixins/FormBase'

  export default {
    mixins: [ FormBase, TeamAction ],
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        penaltyShootout: {
          home_score: null,
          away_score: null
        }
      }
    },
    methods: {
      ...mapActions('penaltyShootout', [
        'create'
      ]),
      async submit () {
        if (this.$refs.form.validate()) {
          try {
            await this.create({
              matchId: this.match.id,
              penaltyShootout: this.penaltyShootout
            })
            this.inForm = false
          } catch (e) {
            this.errorMessage = e.message
          }
        }
      }
    }
  }
</script>
