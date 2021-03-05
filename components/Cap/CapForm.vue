<template>
  <dialog-form
    v-model="dialog"
    title="Add Cap"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          label="Add Player"
          icon="mdi-plus-circle-outline"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <v-select
          v-model="cap.pos"
          label="Position"
          prepend-icon="mdi-run"
          :items="positions"
          :rules="rulesFor.pos"
        />
      </v-col>
      <v-col cols="12">
        <player-select
          v-model="cap.player_id"
          :players="players"
          item-value="id"
          :disabled="cap.start > 0"
          label="Player"
          required
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { positions } from '@/models/Match'
  import { activePlayers } from '@/models/Player'
  import { DialogFormable } from '@/mixins'
  import { isRequired } from '@/functions'

  export default {
    name: 'CapForm',
    mixins: [
      DialogFormable
    ],
    props: {
      match: { type: Object, required: true }
    },
    data: () => ({
      cap: {
        player_id: null,
        pos: ''
      },
      rulesFor: {
        pos: [isRequired('Position')]
      }
    }),
    computed: {
      players () {
        return activePlayers(parseInt(this.$route.params.teamId))
      },
      positions () {
        return Object.keys(positions)
      }
    },
    methods: {
      ...mapActions('caps', {
        createCap: 'CREATE'
      }),
      async submit () {
        await this.createCap({
          matchId: this.match.id,
          cap: this.cap
        })
      }
    }
  }
</script>
