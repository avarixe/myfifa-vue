<template lang="pug">
  v-tooltip(v-if="squads.length > 0" color="cyan" bottom)
    template(#activator="{ on: tooltip }")
      v-menu.d-inline-block(offset-y offset-overflow)
        template(#activator="{ on: menu }")
          v-btn(icon v-on="{ ...menu, ...tooltip }")
            v-icon(color="cyan") mdi-download
        v-list
          v-list-item(
            v-for="squad in squads"
            :key="squad.id"
            @click="applySquadToMatch(squad.id)"
          ) {{ squad.name }}
    | Apply Squad
</template>

<script>
  import { mapActions } from 'vuex'
  import { Squad } from '@/models'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'MatchSquadApplier',
    mixins: [
      TeamAccessible
    ],
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    computed: {
      squads () {
        return Squad
          .query()
          .where('team_id', this.team.id)
          .get()
      }
    },
    methods: {
      ...mapActions('matches', {
        applySquad: 'APPLY_SQUAD'
      }),
      async applySquadToMatch (squadId) {
        try {
          await this.applySquad({
            matchId: this.match.id,
            squadId
          })
        } catch (e) {
          alert(e.message)
        }
      }
    }
  }
</script>
