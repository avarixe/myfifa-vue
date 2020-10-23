<template>
  <v-row dense>
    <v-col
      v-for="(row, i) in positions"
      :key="i"
      cols="12"
    >
      <v-row
        justify="space-around"
        dense
      >
        <formation-cell
          v-for="(pos, j) in row"
          :key="j"
          :pos="pos"
          :players="playersByPosition[pos] || []"
        >
          <template #default="{ players }">
            <slot
              name="position"
              :players="players"
            />
          </template>
        </formation-cell>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
  import groupBy from 'lodash.groupby'

  export default {
    name: 'FormationGrid',
    props: {
      formation: { type: Array, required: true }
    },
    computed: {
      playersByPosition () {
        return groupBy(this.formation, 'pos')
      },
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
      isPositionEmpty (pos) {
        return !(pos in this.playersByPosition)
      },
      isRowEmpty (row) {
        return row.every(pos => this.isPositionEmpty(pos))
      }
    }
  }
</script>
