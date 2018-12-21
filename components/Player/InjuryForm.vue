<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :submit-cb="submitCb"
    color="pink">
    <slot slot="activator">
      <v-tooltip bottom color="pink">
        <v-btn slot="activator" icon>
          <v-icon color="pink">mdi-hospital</v-icon>
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
            prepend-icon="mdi-hospital"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          ></v-text-field>
        </v-flex>
        <v-scroll-y-transition mode="out-in">
          <v-flex v-if="injury.id" xs12>
            <v-checkbox
              v-model="injury.recovered"
              label="Player Recovered"
            ></v-checkbox>
          </v-flex>
        </v-scroll-y-transition>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { Injury } from '@/models'
  import DialogFormable from '@/mixins/DialogFormable'

  export default {
    mixins: [ DialogFormable ],
    props: {
      player: {
        type: Object,
        required: true
      },
      color: String,
      dark: Boolean,
      submitCb: Function
    },
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
      },
      currentInjury () {
        return Injury
          .query()
          .where('player_id', this.player.id)
          .orderBy('start_date')
          .last()
      }
    },
    watch: {
      async dialog (val) {
        if (val) {
          const { description } = this.currentInjury
          Object.assign(this.injury, { description })
        } else {
          Object.assign(this.$data, this.$options.data.apply(this))
          // this.$refs.form.reset()
        }
      }
    },
    methods: {
      ...mapActions('entities/injuries', {
        create: 'CREATE',
        update: 'UPDATE'
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
