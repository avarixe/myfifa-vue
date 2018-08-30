<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    color="pink">
    <slot slot="activator">
      <v-tooltip bottom color="pink">
        <v-btn slot="activator" icon>
          <v-icon color="pink">local_hospital</v-icon>
        </v-btn>
        {{ title }}
      </v-tooltip>
    </slot>
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
        injury: {
          description: '',
          recovered: false
        }
      }
    },
    computed: {
      playerInjured () {
        return this.player.status && this.player.status === 'Injured'
      },
      title () {
        return this.playerInjured
          ? 'Update Injury'
          : 'Record New Injury'
      }
    },
    watch: {
      async dialog (val) {
        if (val && this.playerInjured) {
          try {
            const { data } = await this.getCurrentInjury({ playerId: this.player.id })
            this.injury = data
          } catch (e) {
            alert(e)
            this.dialog = false
          }
        }
      }
    },
    methods: {
      ...mapActions({
        getCurrentInjury: 'player/getCurrentInjury',
        create: 'injury/create',
        update: 'injury/update'
      }),
      async submit () {
        if ('id' in this.injury) {
          await this.update(this.injury)
        } else {
          await this.create({
            playerId: this.player.id,
            injury: this.injury
          })
        }
      }
    }
  }
</script>
