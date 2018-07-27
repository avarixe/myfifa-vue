<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color">
    <slot slot="activator"></slot>
    <v-tooltip slot="activator" bottom :color="color">
      <v-btn slot="activator" icon>
        <v-icon :color="color">local_hospital</v-icon>
      </v-btn>
      {{ title }}
    </v-tooltip>
    <v-container slot="form">
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            v-model="injury.description"
            :rules="$_validate('Description', ['required'])"
            label="Description"
            prepend-icon="local_hospital"
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
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import FormBase from '@/mixins/FormBase'
  import PlayerAction from '@/mixins/PlayerAction'

  export default {
    mixins: [
      FormBase,
      PlayerAction
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
      submit () {
        if ('id' in this.injury) {
          this.update(this.injury)
        } else {
          this.create({
            playerId: this.player.id,
            injury: this.injury
          })
        }
      }
    }
  }
</script>
