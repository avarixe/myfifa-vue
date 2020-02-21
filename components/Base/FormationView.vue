<template lang="pug">
  v-row(dense)
    v-col(
      v-for="(positions, i) in [posATT, posATTMID, posDEFMID, posDEF, posGK]"
      :key="i"
      cols="12"
    )
      v-row(justify="space-around" dense)
        v-col.text-center(
          v-for="(player, j) in compact(positions)"
          :key="j"
          :cols="parseInt(12 / compact(positions).length)"
        )
          slot(name="item" :player="player")
</template>

<script>
  import compact from 'lodash.compact'
  import orderBy from 'lodash.orderby'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import { positions } from '@/models/Match'

  export default {
    name: 'FormationView',
    mixins: [
      TeamAccessible
    ],
    props: {
      formation: { type: Array, required: true }
    },
    data: () => ({
      windows: {}
    }),
    computed: {
      positions () {
        return Object.keys(positions)
      },
      startingEleven () {
        return orderBy(this.formation, p => this.positions.indexOf(p))
      },
      posGK () {
        return [this.startingEleven.find(p => p.pos === 'GK')]
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
      compact (array) {
        return compact(array)
      }
    }
  }
</script>
