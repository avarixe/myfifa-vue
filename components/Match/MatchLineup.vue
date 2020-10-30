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
    <formation-grid :players="starters">
      <template #position="{ player }">
        <cap-view
          v-if="readonly || player.subbed_out"
          :cap="player"
          :match="match"
        />
        <cap-card
          v-else
          :cap="player"
          :match="match"
        />
      </template>
    </formation-grid>
    <v-row v-if="substitutes.length > 0">
      <v-col
        cols="12"
        class="pa-0"
      >
        <v-subheader>Substitutes</v-subheader>
      </v-col>
      <v-col
        v-for="cap in substitutes"
        :key="cap.id"
        cols="2"
        class="text-center"
      >
        <cap-view
          v-if="readonly || cap.subbed_out"
          :cap="cap"
          :match="match"
        />
        <cap-card
          v-else
          :cap="cap"
          :match="match"
        />
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
