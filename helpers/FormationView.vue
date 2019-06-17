<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      v-for="(positions, i) in [
        posATT,
        posATTMID,
        posDEFMID,
        posDEF,
        posGK
      ]"
      :key="i"
      xs12
    >
      <v-layout justify-space-around>
        <v-flex
          v-for="(player, j) in $_compact(positions)"
          :key="j"
          class="text-xs-center"
          v-bind="flexAttributes($_compact(positions))"
        >
          <slot
            name="item"
            :player="player"
          >
            <div class="font-weight-bold">{{ player.pos }}</div>
            <div class="font-weight-thin">{{ nameOf(player.player_id) }}</div>
          </slot>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import { FittyText } from '@/helpers'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import { Player } from '@/models'
  import { positions } from '@/models/Match'

  export default {
    mixins: [
      TeamAccessible
    ],
    components: {
      FittyText
    },
    props: {
      formation: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      windows: {}
    }),
    computed: {
      positions: () => Object.keys(positions),
      startingEleven () {
        return this.$_orderBy(
          this.formation,
          p => this.positions.indexOf(p)
        )
      },
      posGK () {
        return [
          this.startingEleven.find(p => p.pos === 'GK')
        ]
      },
      posDEF () {
        return ['LWB', 'LB', 'LCB', 'CB', 'RCB', 'RB', 'RWB']
          .map(pos => this.retrievePos(pos))
      },
      posDEFMID () {
        return ['LM', 'LDM', 'LCM', 'CDM', 'CM', 'RCM', 'RDM', 'RM']
          .map(pos => this.retrievePos(pos))
      },
      posATTMID () {
        return ['LAM', 'CAM', 'RAM']
          .map(pos => this.retrievePos(pos))
      },
      posATT () {
        return ['LW', 'CF', 'ST', 'RW']
          .map(pos => this.retrievePos(pos))
      }
    },
    created () {
      this.positions.forEach(p => {
        this.windows[p] = 0
      })
    },
    methods: {
      retrievePos (pos) {
        return this.startingEleven.find(p => p.pos === pos)
      },
      nameOf (playerId) {
        const player = Player.find(playerId)
        return player ? player.name : ''
      },
      flexAttributes (items) {
        let attr = {}
        attr[`xs${parseInt(12 / items.length)}`] = true
        return attr
      }
    }
  }
</script>
