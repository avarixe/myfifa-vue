<template>
  <v-container>
    <v-layout class="text-xs-center">
      <v-flex>
        <div class="display-1 primary--text">{{ defOVR }}</div>
        <div class="subheading">DEF</div>
      </v-flex>
      <v-flex>
        <div class="display-1 success--text">{{ midOVR }}</div>
        <div class="subheading">MID</div>
      </v-flex>
      <v-flex>
        <div class="display-1 warning--text">{{ attOVR }}</div>
        <div class="subheading">ATT</div>
      </v-flex>
    </v-layout>

    <v-divider class="mx-3" />

    <formation-view :formation="starters">
      <template #item="{ player }">
        <cap-view
          :cap="player"
          :match="match"
          :readonly="readonly"
        />
      </template>
    </formation-view>

    <v-layout
      v-if="substitutes.length > 0"
      wrap
    >
      <v-flex xs12>
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
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mixins, Component, Prop } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import { FormationView } from '@/helpers'
  import { Player } from '@/models'
  import { positions } from '@/models/Match'
  import CapView from '@/components/Cap/View'
  import CapSubView from '@/components/Cap/SubView'

  @Component({
    components: {
      FormationView,
      CapView,
      CapSubView
    }
  })
  export default class MatchLineup extends mixins(TeamAccessible) {
    @Prop({ type: Object, required: true }) match

    get readonly () {
      return this.team.currently_on !== this.match.played_on
    }

    get starters () {
      return this.match.caps.filter(c => c.start === 0)
    }

    get substitutes () {
      return this.match.caps.filter(c => c.start > 0)
    }

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
</script>
