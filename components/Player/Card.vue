<template>
  <v-card outlined>
    <v-card-title class="subtitle-1 d-block text-center">
      <span :class="`font-weight-light ${color}--text`">
        {{ player.name }}
      </span>
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
        View Player
      </v-btn>
    </v-card-actions>
    <v-card-text class="text-center">
      <v-row>
        <v-col cols="3">
          <div class="display-1">{{ player.pos }}</div>
          <div class="subheading">Position</div>
        </v-col>
        <v-col cols="3">
          <div class="display-1">{{ player.sec_pos | listArray }}</div>
          <div class="subheading">
            <fitty-text text="Secondary Position(s)" />
          </div>
        </v-col>
        <v-col cols="3">
          <div class="display-1">{{ player.age }}</div>
          <div class="subheading">Age</div>
        </v-col>
        <v-col cols="3">
          <v-icon
            class="display-1"
            :color="player.statusColor"
          >
            mdi-{{ player.statusIcon }}
          </v-icon>
          <div class="subheading">{{ player.status || 'Status' }}</div>
        </v-col>
        <v-col cols="6">
          <div class="display-1 success--text">{{ player.ovr }}</div>
          <div class="subheading">OVR</div>
        </v-col>
        <v-col cols="6">
          <div class="display-1 primary--text">
            {{ player.value | formatMoney(team.currency) }}
          </div>
          <div class="subheading">Value</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
  import { Player, Team } from '@/models'

  export default {
    name: 'PlayerCard',
    props: {
      playerId: { type: [Number, String], required: true },
      color: { type: String, default: 'info' }
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
