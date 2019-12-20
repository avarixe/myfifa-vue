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
          .subheadingPosition
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
  import { Component, Vue, Prop } from 'nuxt-property-decorator'
  import { Player, Team } from '@/models'
  import { FittyText } from '@/helpers'

  @Component({
    components: {
      FittyText
    }
  })
  export default class PlayerCard extends Vue {
    @Prop({ type: [Number, String], required: true }) playerId
    @Prop({ type: String, default: 'info' }) color

    get player () {
      return Player.find(this.playerId)
    }

    get team () {
      return Team.find(this.$route.params.teamId)
    }
  }
</script>
