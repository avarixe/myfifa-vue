<script>
  import { ref, toRef, computed, useStore } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'

  export default {
    name: 'MatchSquadSaver',
    props: {
      match: { type: Object, required: true }
    },
    setup (props) {
      const menu = ref(false)
      const loading = ref(false)
      const squadName = ref('')

      const match = toRef(props, 'match')
      const starters = computed(() =>
        match.value.caps.filter(cap => cap.start === 0)
      )

      const store = useStore()
      const { teamId } = useTeam()
      const squads = computed(() => {
        return store.$db().model('Squad')
          .query()
          .with('squadPlayers')
          .where('teamId', parseInt(teamId.value))
          .get()
      })

      const saveLineupToSquad = async squadId => {
        try {
          if (squadId) {
            await store.dispatch('squads/storeLineup', {
              squadId,
              matchId: match.value.id
            })
          } else if (squadName.value) {
            loading.value = true

            await store.dispatch('squads/create', {
              teamId: teamId.value,
              attributes: {
                name: squadName.value,
                squadPlayersAttributes: starters.value.map(cap => ({
                  playerId: cap.playerId,
                  pos: cap.pos
                }))
              }
            })
          }

          menu.value = false
        } catch (e) {
          alert(e.message)
        } finally {
          loading.value = false
        }
      }

      return {
        menu,
        loading,
        squadName,
        squads,
        starters,
        saveLineupToSquad
      }
    }
  }
</script>

<template>
  <v-tooltip
    v-if="starters.length === 11"
    color="teal"
    bottom
  >
    <template #activator="{ on: tooltip }">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        offset-y
        offset-overflow
        class="d-inline-block"
      >
        <template #activator="{ on: menu }">
          <v-btn
            icon
            v-on="{ ...menu, ...tooltip }"
          >
            <v-icon color="teal">mdi-upload</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-text-field
              v-model="squadName"
              label="New Squad"
              :loading="loading"
              :disabled="loading"
              hint="Press Enter to Save"
              @keypress.enter.prevent="saveLineupToSquad(null)"
            />
          </v-list-item>
          <v-list-item
            v-for="squad in squads"
            :key="squad.id"
            @click="saveLineupToSquad(squad.id)"
          >
            {{ squad.name }}
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    Save Lineup to Squad
  </v-tooltip>
</template>
