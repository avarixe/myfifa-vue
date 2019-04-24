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

    <v-container slot="form">
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
          <v-select
            v-model="cap.player_id"
            :items="players"
            item-text="name"
            item-value="id"
            :rules="$_validate('Player', ['required'])"
            :disabled="cap.start > 0"
            label="Player"
            prepend-icon="mdi-account"
          >
            <template #item="{ item }">
              <v-list-tile-action>
                <v-list-tile-action-text>{{ item.pos }}</v-list-tile-action-text>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              </v-list-tile-content>
            </template>
          </v-select>
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import { mapState } from 'vuex'
  import { activePlayers } from '@/models/Player'
  import { DialogFormable } from '@/mixins'

  export default {
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
