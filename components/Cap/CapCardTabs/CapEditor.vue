<script>
  import { ref, toRef, watchEffect, useStore } from '@nuxtjs/composition-api'
  import { useActivePlayers } from '@/composables'
  import { matchPositions } from '@/constants'

  export default {
    name: 'CapEditor',
    props: {
      cap: { type: Object, required: true }
    },
    setup (props, { emit }) {
      const pos = ref(null)
      const playerId = ref(null)

      const cap = toRef(props, 'cap')
      watchEffect(() => {
        pos.value = cap.value.pos
        playerId.value = cap.value.playerId
      })

      const store = useStore()
      const updateCapAttribute = async (key, value) => {
        try {
          await store.dispatch('caps/update', {
            id: cap.value.id,
            attributes: { [key]: value }
          })
          emit('submitted')
        } catch (e) {
          pos.value = cap.value.pos
          playerId.value = cap.value.playerId
          store.commit('broadcaster/announce', {
            message: e.message,
            color: 'red'
          })
        }
      }

      const setPosition = async value => {
        await updateCapAttribute('pos', value)
      }
      const setPlayer = async value => {
        await updateCapAttribute('playerId', value)
      }

      const activePlayers = useActivePlayers()
      return {
        pos,
        playerId,
        positions: Object.keys(matchPositions),
        activePlayers,
        setPosition,
        setPlayer
      }
    }
  }
</script>

<template>
  <div class="pa-2">
    <div class="text-subtitle-2 pb-2">
      Edit Position and Player
    </div>
    <v-select
      v-model="pos"
      label="Position"
      prepend-icon="mdi-run"
      :items="positions"
      menu-props="auto"
      required
      @change="setPosition"
    />
    <player-select
      v-model="playerId"
      :players="activePlayers"
      item-value="id"
      required
      :disabled="cap.start > 0"
      @input="setPlayer"
    />
  </div>
</template>
