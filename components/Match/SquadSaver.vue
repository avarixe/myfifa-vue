<template lang="pug">
  v-tooltip(v-if="starters.length === 11" color="teal" bottom)
    template(#activator="{ on: tooltip }")
      v-menu.d-inline-block(
        v-model="menu"
        :close-on-content-click="false"
        offset-y
        offset-overflow
      )
        template(#activator="{ on: menu }")
          v-btn(icon v-on="{ ...menu, ...tooltip }")
            v-icon(color="teal") mdi-upload
        v-list
          v-list-item
            v-text-field(
              v-model="squadName"
              label="New Squad"
              :loading="loading"
              :disabled="loading"
              hint="Press Enter to Save"
              @keypress.enter.prevent="saveLineupToSquad(null)"
            )
          v-list-item(
            v-for="squad in squads"
            :key="squad.id"
            @click="saveLineupToSquad(squad.id)"
          ) {{ squad.name }}
    | Save Lineup to Squad
</template>

<script>
  import { mapActions } from 'vuex'
  import { Squad } from '@/models'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'MatchSquadSaver',
    mixins: [
      TeamAccessible
    ],
    props: {
      match: { type: Object, required: true }
    },
    data: () => ({
      menu: false,
      loading: false,
      squadName: ''
    }),
    computed: {
      squads () {
        return Squad
          .query()
          .with('squad_players')
          .where('team_id', this.team.id)
          .get()
      },
      starters () {
        return this.match.caps.filter(c => c.start === 0)
      }
    },
    methods: {
      ...mapActions('squads', {
        createSquad: 'CREATE',
        storeLineup: 'STORE_LINEUP'
      }),
      async saveLineupToSquad (squadId) {
        try {
          if (squadId) {
            await this.storeLineup({ squadId, matchId: this.match.id })
          } else if (this.squadName) {
            this.loading = true

            let squadPlayers = []

            this.starters.forEach(cap => {
              squadPlayers.push({ player_id: cap.player_id, pos: cap.pos })
            })

            await this.createSquad({
              teamId: this.team.id,
              squad: {
                name: this.squadName,
                squad_players_attributes: squadPlayers
              }
            })
          }

          this.menu = false
        } catch (e) {
          alert(e.message)
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
