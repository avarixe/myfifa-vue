<script>
  import { reactive, useStore } from '@nuxtjs/composition-api'
  import { useActivePlayers } from '@/composables'
  import { matchPositions } from '@/constants'
  import { isRequired } from '@/functions'

  export default {
    name: 'CapForm',
    props: {
      match: { type: Object, required: true }
    },
    setup () {
      const attributes = reactive({
        playerId: null,
        pos: ''
      })

      const store = useStore()
      const submit = async () => {
        await store.dispatch('caps/create', {
          matchId: props.match.id,
          attributes
        })
      }

      const activePlayers = useActivePlayers()
      return {
        attributes,
        rulesFor: {
          pos: [isRequired('Position')]
        },
        positions: Object.keys(matchPositions),
        activePlayers,
        submit
      }
    }
  }
</script>

<template>
  <dialog-form
    title="Add Cap"
    :submit="submit"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      >
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
          v-model="attributes.pos"
          label="Position"
          prepend-icon="mdi-run"
          :items="positions"
          :rules="rulesFor.pos"
        />
      </v-col>
      <v-col cols="12">
        <player-select
          v-model="attributes.playerId"
          :players="activePlayers"
          item-value="id"
          :disabled="attributes.start > 0"
          label="Player"
          required
        />
      </v-col>
    </template>
  </dialog-form>
</template>
