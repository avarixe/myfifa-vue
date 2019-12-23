<template lang="pug">
  v-menu(
    :close-on-content-click="false"
    offset-y
    offset-overflow
  )
    template(#activator="{ on }")
      v-btn(icon v-on="on")
        v-icon mdi-plus
    v-list(dense)
      template(v-if="team")
        player-form
          template(#default="{ on }")
            v-list-item(v-on="on")
              v-list-item-avatar
                v-icon mdi-account-plus
              v-list-item-content New Player
        match-form
          template(#default="{ on }")
            v-list-item(v-on="on")
              v-list-item-avatar
                v-icon mdi-soccer-field
              v-list-item-content New Match
        squad-form
          template(#default="{ on }")
            v-list-item(v-on="on")
              v-list-item-avatar
                v-icon mdi-clipboard-plus
              v-list-item-content New Squad
        competition-form
          template(#default="{ on }")
            v-list-item(v-on="on")
              v-list-item-avatar
                v-icon mdi-trophy
              v-list-item-content New Competition
      v-divider
      team-form
        template(#default="{ on }")
          v-list-item(v-on="on")
            v-list-item-avatar
              v-icon mdi-shield-plus
            v-list-item-content New Team
</template>

<script>
  import { Team } from '@/models'
  import CompetitionForm from '@/components/Competition/Form'
  import MatchForm from '@/components/Match/Form'
  import PlayerForm from '@/components/Player/Form'
  import SquadForm from '@/components/Squad/Form'
  import TeamForm from '@/components/Team/Form'

  export default {
    name: 'AppFormsMenu',
    components: {
      CompetitionForm,
      MatchForm,
      PlayerForm,
      SquadForm,
      TeamForm
    },
    computed: {
      team () {
        return this.$route.params.teamId && Team.find(this.$route.params.teamId)
      },
      links () {
        if (this.team) {
          return [
            {
              text: 'New Player',
              icon: 'account-plus',
              name: 'teams-teamId-players-new',
              params: { teamId: this.team.id }
            },
            {
              text: 'New Match',
              icon: 'soccer-field',
              name: 'teams-teamId-matches-new',
              params: { teamId: this.team.id }
            },
            {
              text: 'New Squad',
              icon: 'clipboard-plus',
              name: 'teams-teamId-squads-new',
              params: { teamId: this.team.id }
            }
          ]
        } else {
          return []
        }
      }
    }
  }
</script>
