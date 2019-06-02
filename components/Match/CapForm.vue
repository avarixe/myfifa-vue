<template>
  <dialog-form
    v-model="dialog"
    title="Add Cap"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>

    <template #form>
      <v-container>
        <v-layout wrap>
          <v-flex xs12>
            <v-select
              v-model="cap.pos"
              :items="positions"
              :rules="$_validate('Position', ['required'])"
              label="Position"
              prepend-icon="mdi-run"
            />
          </v-flex>
          <v-flex xs12>
            <player-select
              v-model="cap.player_id"
              :players="players"
              item-value="id"
              :rules="$_validate('Player', ['required'])"
              :disabled="cap.start > 0"
              label="Player"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mapState } from 'vuex'
  import { activePlayers } from '@/models/Player'
  import { PlayerSelect } from '@/helpers'
  import { DialogFormable } from '@/mixins'

  export default {
    components: {
      PlayerSelect
    },
    mixins: [
      DialogFormable
    ],
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        cap: {
          player_id: null,
          pos: ''
        }
      }
    },
    computed: {
      ...mapState('matches', [
        'positions'
      ]),
      players () {
        return activePlayers(parseInt(this.$route.params.teamId))
      }
    },
    methods: {
      async submit () {
        await this.$store.dispatch('caps/CREATE', {
          matchId: this.match.id,
          cap: this.cap
        })
      }
    }
  }
</script>
