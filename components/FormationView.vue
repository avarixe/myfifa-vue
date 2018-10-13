<template>
  <v-container flat>
    <v-layout row wrap>
      <v-flex
        v-for="(positions, i) in [posATT, posATTMID, posDEFMID, posDEF, posGK]"
        :key="i"
        xs12>
        <v-layout>
          <v-flex
            v-for="(players, j) in $_compact(positions)"
            :key="j"
            class="text-xs-center">
            <v-carousel
              hide-delimiters
              :hide-controls="players.length === 1"
              height="auto"
              :cycle="false">
              <v-carousel-item
                v-for="(player, k) in players"
                :key="k">
                <slot name="item" :player="player">
                  <div class="body-2">{{ nameOf(player.player_id) }}</div>
                  <div class="body-1">{{ player.pos }}</div>
                </slot>
              </v-carousel-item>
            </v-carousel>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    props: {
      formation: {
        type: Array,
        required: true
      }
    },
    data () {
      let windows = {}
      return { windows }
    },
    computed: {
      ...mapState('player', { players: 'list' }),
      ...mapState('match', ['positions']),
      groupedPlayers () {
        return this.$_groupBy(this.formation, 'pos')
      },
      posGK () {
        return [
          this.groupedPlayers['GK']
        ]
      },
      posDEF () {
        return ['RWB', 'RB', 'RCB', 'CB', 'LCB', 'LB', 'LWB' ]
          .map(pos => this.groupedPlayers[pos])
      },
      posDEFMID () {
        return ['LM', 'LDM', 'LCM', 'CDM', 'CM', 'RCM', 'RDM', 'RM']
          .map(pos => this.groupedPlayers[pos])
      },
      posATTMID () {
        return ['LAM', 'CAM', 'RAM']
          .map(pos => this.groupedPlayers[pos])
      },
      posATT () {
        return ['LW', 'CF', 'ST', 'RW']
          .map(pos => this.groupedPlayers[pos])
      }
    },
    created () {
      this.positions.forEach(p => {
        this.windows[p] = 0
      })
    },
    methods: {
      nameOf (playerId) {
        return playerId in this.players
          ? this.players[playerId].name
          : ''
      }
    }
  }
</script>

<style scoped>
  >>> .v-carousel { box-shadow: 0 0 transparent; }
  >>> .v-carousel__next .v-icon,
  >>> .v-carousel__prev .v-icon  {
    color: #333;
    font-size: 24px !important;
  }
</style>
