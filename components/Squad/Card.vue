<template lang="pug">
  v-card
    v-toolbar(color="blue")
      v-toolbar-title.font-weight-light.white--text {{ squad.name }}
      v-spacer
      squad-form(:record="squad" color="orange")
        template(#default="{ on }")
          tooltip-button(
            label="Edit"
            icon="mdi-pencil"
            color="orange"
            :on="on"
          )
      record-remove(
        :record="squad"
        store="squads"
        :label="`Squad: ${ squad.name }`"
        small
      )
    v-card-text
      v-row.text-center(dense)
        v-col
          .display-1.primary--text {{ defOVR }}
          .subheading DEF
        v-col
          .display-1.success--text {{ midOVR }}
          .subheading MID
        v-col
          .display-1.warning--text {{ attOVR }}
          .subheading ATT
      v-divider.mx-3
      formation-view(:formation="squad.squad_players")
        template(#item="{ player }")
          .font-weight-bold {{ player.pos }}
          .font-weight-thin(:class="statusColor(player.player_id)")
            | {{ nameOf(player.player_id) }}
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { FormationView, RecordRemove, TooltipButton } from '@/helpers'
  import { Player } from '@/models'
  import SquadForm from './Form'

  @Component({
    components: {
      SquadForm,
      FormationView,
      RecordRemove,
      TooltipButton
    }
  })
  export default class SquadCard extends Vue {
    @Prop({ type: Object, required: true }) squad

    get defOVR () {
      return this.avgOVR('DEF')
    }

    get midOVR () {
      return this.avgOVR('MID')
    }

    get attOVR () {
      return this.avgOVR('ATT')
    }

    avgOVR (positionType) {
      let playerIds = []

      this.squad.squad_players.forEach(squadPlayer => {
        if (squadPlayer.positionType === positionType) {
          playerIds.push(squadPlayer.player_id)
        }
      })

      const totalOvr = Player
        .query()
        .whereIdIn(playerIds)
        .sum('ovr')

      return Math.round(totalOvr / playerIds.length)
    }

    nameOf (playerId) {
      const player = Player.find(playerId)
      return player ? player.name : ''
    }

    statusColor (playerId) {
      const player = Player.find(playerId)
      if (player && player.status === 'Active') {
        return ''
      } else {
        return 'red--text'
      }
    }
  }
</script>
