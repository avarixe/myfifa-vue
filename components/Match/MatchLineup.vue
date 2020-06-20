<template>
  <v-container>
    <v-row
      v-if="match.caps.length >= 11"
      class="text-center"
      dense
    >
      <v-col>
        <div class="text-h4 primary--text">{{ defOVR }}</div>
        <div class="subheading">DEF</div>
      </v-col>
      <v-col>
        <div class="text-h4 success--text">{{ midOVR }}</div>
        <div class="subheading">MID</div>
      </v-col>
      <v-col>
        <div class="text-h4 warning--text">{{ attOVR }}</div>
        <div class="subheading">ATT</div>
      </v-col>
    </v-row>
    <v-divider class="mx-3 mb-2" />
    <formation-view :formation="starters">
      <template #item="{ player }">
        <cap-view
          :cap="player"
          :match="match"
          :readonly="readonly"
        />
      </template>
    </formation-view>
    <v-row v-if="substitutes.length > 0">
      <v-col>
        <v-list dense>
          <v-subheader>Substitutes</v-subheader>
          <cap-sub-view
            v-for="cap in substitutes"
            :key="cap.id"
            :cap="cap"
            :match="match"
            :readonly="readonly"
          />
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { TeamAccessible } from '@/mixins'
  import { Player } from '@/models'
  import { positions } from '@/models/Match'

  export default {
    name: 'MatchLineup',
    mixins: [
      TeamAccessible
    ],
    props: {
      match: { type: Object, required: true }
    },
    computed: {
      readonly () {
        return this.team.currently_on !== this.match.played_on
      },
      starters () {
        return this.match.caps.filter(c => c.start === 0)
      },
      substitutes () {
        return this.match.caps.filter(c => c.start > 0)
      },
      defOVR () {
        return this.avgOVR('DEF')
      },
      midOVR () {
        return this.avgOVR('MID')
      },
      attOVR () {
        return this.avgOVR('ATT')
      }
    },
    methods: {
      avgOVR (positionType) {
        let playerIds = []

        this.match.caps.forEach(cap => {
          if (positions[cap.pos] === positionType) {
            playerIds.push(cap.player_id)
          }
        })

        const totalOvr = Player
          .query()
          .whereIdIn(playerIds)
          .get()
          .reduce(
            (sum, player) => sum + player.ovrAt(this.match.played_on),
            0
          )

        return Math.round(totalOvr / playerIds.length)
      }
    }
  }
</script>
