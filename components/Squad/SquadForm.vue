<script>
  import {
    ref,
    toRef,
    reactive,
    computed,
    watchEffect,
    useStore
  } from '@nuxtjs/composition-api'
  import { useActivePlayers, useTeam } from '@/composables'
  import { matchPositions } from '@/constants'
  import { isRequired } from '@/functions'

  export default {
    name: 'SquadForm',
    props: {
      record: { type: Object, default: null }
    },
    setup (props) {
      const attributes = reactive({
        name: '',
        squadPlayersAttributes: new Array(11).fill().map((_, id) => ({
          id,
          playerId: null,
          pos: null
        }))
      })

      const positions = Object.keys(matchPositions)
      const sortedSquadPlayers = computed(() =>
        [...attributes.squadPlayersAttributes].sort((a, b) => {
          return a.pos && positions.indexOf(a.pos) < positions.indexOf(b.pos)
            ? -1
            : 1
        })
      )

      const dialog = ref(false)
      const record = toRef(props, 'record')
      const title = ref('New Squad')
      watchEffect(() => {
        if (dialog.value && record.value) {
          attributes.name = record.value.name
          attributes.squadPlayersAttributes = record.value.squadPlayers
            .map(squadPlayer => ({
              id: squadPlayer.id,
              playerId: squadPlayer.playerId,
              pos: squadPlayer.pos
            }))
        }
      })

      const store = useStore()
      const { teamId } = useTeam()
      const submit = async () => {
        if (record.value) {
          await store.dispatch('squads/update', {
            id: record.value.id,
            attributes
          })
        } else {
          attributes.squadPlayersAttributes.forEach(attributes => {
            delete attributes.id
          })
          await store.dispatch('squads/create', {
            teamId: teamId.value,
            attributes
          })
        }
      }

      const activePlayers = useActivePlayers()

      return {
        attributes,
        dialog,
        title,
        submit,
        sortedSquadPlayers,
        positions,
        activePlayers,
        rulesFor: {
          name: [isRequired('Name')],
          pos: [isRequired('Position')]
        }
      }
    }
  }
</script>

<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      />
    </template>
    <template #form>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.name"
          label="Name"
          prepend-icon="mdi-clipboard-text"
          :rules="rulesFor.name"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <template v-for="(squadPlayer, i) in sortedSquadPlayers">
        <v-col
          :key="`pos${i}`"
          cols="4"
        >
          <v-select
            v-model="squadPlayer.pos"
            label="Position"
            prepend-icon="mdi-run"
            :items="positions"
            :rules="rulesFor.pos"
            menu-props="auto"
            hide-details
          />
        </v-col>
        <v-col
          :key="`player${i}`"
          cols="8"
        >
          <player-select
            v-model="squadPlayer.playerId"
            :players="activePlayers"
            item-value="id"
            label="Player"
            required
            hide-details
          />
        </v-col>
      </template>
    </template>
  </dialog-form>
</template>
