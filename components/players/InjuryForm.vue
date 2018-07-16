<template>
  <v-tooltip bottom :color="color">
    <v-btn
      icon
      slot="activator"
      @click="inForm = true">
      <v-icon :color="color">local_hospital</v-icon>
      <v-dialog v-model="inForm" max-width="500px">
        <v-form ref="form" v-model="valid" @submit.prevent="save">
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
                      :rules="$validate('Description', ['required'])"
                      label="Description"
                      prepend-inner-icon="local_hospital"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-checkbox
                      v-model="injury.recovered"
                      v-if="injury.id"
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
                :color="color"
                flat
                large
              >Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-btn>
    {{ title }}
  </v-tooltip>
</template>

<script>
  import { mapActions } from 'vuex'
  import FormMixin from '@/mixins/Form'
  import PlayerAction from '@/mixins/PlayerAction'

  export default {
    mixins: [ FormMixin, PlayerAction ],
    props: [
      'player',
      'color',
      'dark'
    ],
    data () {
      return {
        valid: !!this.player.active_injury,
        injury: Object.assign({
          description: '',
          recovered: false
        }, this.player.active_injury)
      }
    },
    computed: {
      title () {
        return this.injury && this.injury.id ? 'Update Injury' : 'Record New Injury'
      }
    },
    watch: {
      player (val) {
        Object.assign(this.$data, this.$options.data.apply(this))
      }
    },
    methods: {
      ...mapActions('injury', [
        'create',
        'update'
      ]),
      save () {
        if (this.$refs.form.validate()) {
          let params, save
          if ('id' in this.injury) {
            params = this.injury
            save = this.update
          } else {
            params = { playerId: this.player.id, injury: this.injury }
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
