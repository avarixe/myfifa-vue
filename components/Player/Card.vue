<template>
  <v-card outlined>
    <v-card-title :class="`subtitle-1 d-block text-xs-center`">
      <span :class="`${color}--text font-weight-light`">{{ player.name }}</span>
    </v-card-title>

    <v-divider class="mx-3" />

    <v-card-actions>
      <v-btn
        :to="player.link"
        nuxt
        :color="color"
        block
        text
      >
        <badged-link
          :color="color"
          text="View Player"
        />
      </v-btn>
    </v-card-actions>

    <v-card-text class="text-xs-center">
      <v-layout wrap>
        <v-flex xs3>
          <div class="display-1">{{ player.pos }}</div>
          <div class="subheading">Position</div>
        </v-flex>
        <v-flex xs3>
          <div class="display-1">{{ $_listArray(player.sec_pos) }}</div>
          <div class="subheading">
            <fitty-text text="Secondary Position(s)" />
          </div>
        </v-flex>
        <v-flex xs3>
          <div class="display-1">{{ player.age }}</div>
          <div class="subheading">Age</div>
        </v-flex>
        <v-flex xs3>
          <v-icon
            v-if="player.isActive"
            :color="player.statusColor"
            class="display-1"
          >mdi-{{ player.statusIcon }}</v-icon>
          <div
            v-else
            class="display-1"
          >-</div>

          <div class="subheading">{{ player.status || 'Status' }}</div>
        </v-flex>
        <v-flex xs-6>
          <div class="display-1 success--text">{{ player.ovr }}</div>
          <div class="subheading">OVR</div>
        </v-flex>
        <v-flex xs-6>
          <div class="display-1 primary--text">{{ $_formatMoney(player.value) }}</div>
          <div class="subheading">Value</div>
        </v-flex>

      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { Player, Team } from '@/models'
  import { BadgedLink, FittyText } from '@/helpers'

  @Component({
    components: {
      BadgedLink,
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
