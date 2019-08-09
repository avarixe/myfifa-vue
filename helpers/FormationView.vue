<template>
  <v-row dense>
    <v-col
      v-for="(positions, i) in [
        posATT,
        posATTMID,
        posDEFMID,
        posDEF,
        posGK
      ]"
      :key="i"
      cols="12"
    >
      <v-row
        justify="space-around"
        dense
      >
        <v-col
          v-for="(player, j) in $_compact(positions)"
          :key="j"
          class="text-center"
          :cols="parseInt(12 / $_compact(positions).length)"
        >
          <slot
            name="item"
            :player="player"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
  import { mixins, Component, Prop } from 'nuxt-property-decorator'
  import { FittyText } from '@/helpers'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import { positions } from '@/models/Match'

  @Component({
    components: {
      FittyText
    }
  })
  export default class FormationView extends mixins(TeamAccessible) {
    @Prop({ type: Array, required: true }) formation

    windows = {}

    get positions () {
      return Object.keys(positions)
    }

    get startingEleven () {
      return this.$_orderBy(
        this.formation,
        p => this.positions.indexOf(p)
      )
    }

    get posGK () {
      return [
        this.startingEleven.find(p => p.pos === 'GK')
      ]
    }

    get posDEF () {
      return ['LWB', 'LB', 'LCB', 'CB', 'RCB', 'RB', 'RWB']
        .map(pos => this.retrievePos(pos))
    }

    get posDEFMID () {
      return ['LM', 'LDM', 'LCM', 'CDM', 'CM', 'RCM', 'RDM', 'RM']
        .map(pos => this.retrievePos(pos))
    }

    get posATTMID () {
      return ['LAM', 'CAM', 'RAM']
        .map(pos => this.retrievePos(pos))
    }

    get posATT () {
      return ['LW', 'CF', 'ST', 'RW']
        .map(pos => this.retrievePos(pos))
    }

    created () {
      this.positions.forEach(p => {
        this.windows[p] = 0
      })
    }

    retrievePos (pos) {
      return this.startingEleven.find(p => p.pos === pos)
    }
  }
</script>
