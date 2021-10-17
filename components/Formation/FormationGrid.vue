<script>
  import { toRef } from '@nuxtjs/composition-api'

  export default {
    name: 'FormationGrid',
    props: {
      players: { type: Array, required: true }
    },
    setup (props) {
      const players = toRef(props, 'players')
      const playerInPosition = pos => players.value.find(player => player.pos === pos)

      return {
        playerInPosition,
        positions: [
          [null, 'LS', 'ST', 'RS', null],
          ['LW', 'LF', 'CF', 'RF', 'RW'],
          [null, 'LAM', 'CAM', 'RAM', null],
          ['LM', 'LCM', 'CM', 'RCM', 'RM'],
          ['LWB', 'LDM', 'CDM', 'RDM', 'RWB'],
          ['LB', 'LCB', 'CB', 'RCB', 'RB'],
          [null, null, 'GK', null, null]
        ]
      }
    }
  }
</script>

<template>
  <v-container>
    <v-row
      v-for="(row, i) in positions"
      :key="i"
      justify="space-around"
      dense
    >
      <formation-cell
        v-for="(pos, j) in row"
        :key="j"
        :pos="pos"
        :player="playerInPosition(pos)"
      >
        <template #default="{ pos, player }">
          <slot
            name="position"
            :pos="pos"
            :player="player"
          />
        </template>
      </formation-cell>
    </v-row>
    <slot name="footer" />
  </v-container>
</template>
