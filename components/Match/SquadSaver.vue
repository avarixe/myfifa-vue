<template lang="pug">
  v-tooltip(v-if="match.caps.length === 11" color="green" bottom)
    template(#activator="{ on: tooltip }")
      v-menu.d-inline-block(
        v-model="menu"
        :close-on-content-click="false"
        offset-y
        offset-overflow
      )
        template(#activator="{ on: menu }")
          v-btn(icon v-on="{ ...menu, ...tooltip }")
            v-icon(color="green") mdi-clipboard-arrow-up
        v-list
          v-list-item(
            v-for="squad in squads"
            :key="squad.id"
            @click="saveLineupToSquad(squad.id)"
          ) {{ squad.name }}
          v-list-item
            v-text-field(
              v-model="squadName"
              label="New Squad"
              :loading="loading"
              :disabled="loading"
              hint="Press Enter to Save"
              @keypress.enter="saveLineupToSquad(null)"
            )
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
      match: {
        type: Object,
        required: true
      }
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
          .where('team_id', this.team.id)
          .get()
      }
    },
    methods: {
      ...mapActions('squads', {
        createSquad: 'CREATE',
        updateSquad: 'UPDATE'
      }),
      async saveLineupToSquad (squadId) {
        try {
          if (squadId) {
            console.log('overwrite Squad!')
          } else {
            this.loading = true
            console.log('create new Squad!')
          }
          // await this.updateSquad({
          //   matchId: this.match.id,
          //   squadId
          // })

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
