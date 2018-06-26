<template>
  <v-tooltip bottom :color="color + ' darken-2'">
    <v-btn
      icon
      slot="activator"
      @click="open">
      <v-icon :color="color + ' darken-2'">fa-ambulance</v-icon>
      <v-dialog v-model="inForm" max-width="500px">
        <v-form v-model="valid" @submit.prevent="injury.id ? createInjury() : updateInjury()">
          <v-card>
            <v-card-title
              primary-title
              :class="color + ' accent-2'">
              <div class="headline">{{ title }}</div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field
                      v-model="injury.description"
                      label="Description"
                      required
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-checkbox
                      v-model="recovered"
                      label="Player Recovered"
                    ></v-checkbox>
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
                :color="color + ' darken-2'"
                flat
                large
              >Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-btn>
    <span>{{ title }}</span>
  </v-tooltip>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    props: [
      'player',
      'color',
      'dark'
    ],
    data: () => ({
      inForm: false,
      valid: false,
      errorMessage: '',
      injury: {
        description: '',
        end_date: null
      },
      recovered: false
    }),
    computed: {
      ...mapState('team', {
        team: 'active'
      }),
      title () {
        return this.injury && this.injury.id ? 'Update Injury' : 'Record New Injury'
      },
      formError: {
        get: function () { return this.errorMessage.length > 0 },
        set: function (val) { this.errorMessage = val }
      }
    },
    watch: {
      recovered (val) {
        this.injury.end_date = val ? this.team.current_date : null
      }
    },
    methods: {
      ...mapActions('injury', [
        'create',
        'update'
      ]),
      open () {
        this.inForm = true
      },
      close () {
        this.inForm = false
        this.errorMessage = ''
      },
      createInjury () {
        this.create({
          playerId: this.player.id,
          injury: this.injury
        }).then((data) => { this.close() })
          .catch((error) => { this.errorMessage = error.message })
      },
      updateInjury () {
        this.update(this.injury)
          .then((data) => { this.close() })
          .catch((error) => { this.errorMessage = error.message })
      }
    },
    mounted () {
      if (this.player.status === 'Injured') {
        this.injury = this.player.last_injury
      }
    }
  }
</script>