<template>
  <div class="d-inline-block" @click="open">
    <slot></slot>
    <v-dialog v-model="inForm" max-width="500px">
      <v-form v-model="valid" @submit.prevent="id ? updatePlayer() : createPlayer()">
        <v-card>
          <v-card-title primary-title>
            <div class="headline">{{ title }}</div>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="player.name"
                    label="Name"
                    autofocus
                    required
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
  // import { format } from 'date-fns'

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
        player: {
          id: '',
          name: ''
          // start_date: format(new Date(), 'YYYY-MM-DD')
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
        get: 'player/get',
        create: 'player/create',
        update: 'player/update'
      }),
      open () {
        this.inForm = true

        if (this.id) {
          this.get({ playerId: this.id })
            .then((data) => { this.player = data })
            .catch((error) => { this.errorMessage = error.message })
        }
      },
      createPlayer () {
        this.create(this.player)
          .then((data) => { this.inForm = false })
          .catch((error) => { this.errorMessage = error.message })
      },
      updatePlayer () {
        this.update(this.player)
          .then((data) => { this.inForm = false })
          .catch((error) => { this.errorMessage = error.message })
      }
    }
  }
</script>