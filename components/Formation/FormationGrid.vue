<template>
  <v-container>
    <v-row
      v-for="(row, i) in positions"
      :key="i"
      justify="space-around"
      dense
    >
      <formation-cell
        v-for="(position, j) in row"
        :key="j"
        :pos="position"
        :player="playerInPosition(position)"
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

<script>
  export default {
    name: 'FormationGrid',
    props: {
      players: { type: Array, required: true }
    },
    computed: {
      positions () {
        return [
          [null, 'LS', 'ST', 'RS', null],
          ['LW', 'LF', 'CF', 'RF', 'RW'],
          [null, 'LAM', 'CAM', 'RAM', null],
          ['LM', 'LCM', 'CM', 'RCM', 'RM'],
          ['LWB', 'LDM', 'CDM', 'RDM', 'RWB'],
          ['LB', 'LCB', 'CB', 'RCB', 'RB'],
          [null, null, 'GK', null, null]
        ]
      }
    },
    methods: {
      playerInPosition (pos) {
        return this.players.find(player => player.pos === pos)
      }
    }
  }
</script>
