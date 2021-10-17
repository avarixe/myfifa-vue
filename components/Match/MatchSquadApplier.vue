<script>
  import { computed, useStore } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'

  export default {
    name: 'MatchSquadApplier',
    props: {
      match: { type: Object, required: true }
    },
    setup (props) {
      const store = useStore()
      const { teamId } = useTeam()
      const squads = computed(() => {
        return store.$db().model('Squad')
          .query()
          .where('teamId', teamId.value)
          .get()
      })

      const applySquadToMatch = async squadId => {
        try {
          await store.dispatch('matches/applySquad', {
            matchId: props.match.id,
            squadId
          })
        } catch (e) {
          alert(e.message)
        }
      }

      return {
        squads,
        applySquadToMatch
      }
    }
  }
</script>

<template>
  <v-tooltip
    v-if="squads.length > 0"
    color="cyan"
    bottom
  >
    <template #activator="{ on: tooltip }">
      <v-menu
        class="d-inline-block"
        offset-y
        offset-overflow
      >
        <template #activator="{ on: menu }">
          <v-btn
            icon
            v-on="{ ...menu, ...tooltip }"
          >
            <v-icon color="cyan">mdi-download</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="squad in squads"
            :key="squad.id"
            @click="applySquadToMatch(squad.id)"
          >
            {{ squad.name }}
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    Apply Squad
  </v-tooltip>
</template>
