<template lang="pug">
  v-card(outlined)
    v-card-title.subtitle-1.d-block.text-center
      span.font-weight-light(:class="`${color}--text`") {{ player.name }}
    v-divider.mx-3
    v-card-actions
      v-btn(
        :to="player.link"
        nuxt
        :color="color"
        block
        text
      ) View Player
    v-card-text.text-center
      v-row
        v-col(cols=3)
          .display-1 {{ player.pos }}
          .subheading Position
        v-col(cols=3)
          .display-1 {{ player.sec_pos | listArray }}
          .subheading
            fitty-text(text="Secondary Position(s)")
        v-col(cols=3)
          .display-1 {{ player.age }}
          .subheading Age
        v-col(cols=3)
          v-icon.display-1(:color="player.statusColor")
            | mdi-{{ player.statusIcon }}
          .subheading {{ player.status || 'Status' }}
        v-col(cols=6)
          .display-1.success--text {{ player.ovr }}
          .subheading OVR
        v-col(cols=6)
          .display-1.primary--text
            | {{ player.value | formatMoney(team.currency) }}
          .subheading Value
</template>

<script>
  import { Player, Team } from '@/models'

  export default {
    name: 'PlayerCard',
    props: {
      playerId: {
        type: [Number, String],
        required: true
      },
      color: {
        type: String,
        default: 'info'
      }
    },
    computed: {
      player () {
        return Player.find(this.playerId)
      },
      team () {
        return Team.find(this.$route.params.teamId)
      }
    }
  }
</script>
