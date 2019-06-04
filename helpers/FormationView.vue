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
      <v-layout>
        <v-flex
          v-for="(player, j) in $_compact(positions)"
          :key="j"
          class="text-xs-center"
        >
          <slot
            name="item"
            :player="player"
          >
            <div class="font-weight-thin">{{ nameOf(player.player_id) }}</div>
            <div class="font-weight-bold">{{ player.pos }}</div>
          </slot>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapState } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import { Player } from '@/models'

  export default {
    mixins: [
      TeamAccessible
    ],
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
      ...mapState('matches', [
        'positions'
      ]),
      startingEleven () {
        return this.$_orderBy(
          this.formation.filter(p => !('start' in p) || p.start === 0),
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
      }
    }
  }
</script>
