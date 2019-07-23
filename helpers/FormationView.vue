<template>
  <v-layout wrap>
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
          class="text-center"
          v-bind="flexAttributes($_compact(positions))"
        >
          <slot
            name="item"
            :player="player"
          />
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
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

    flexAttributes (items) {
      let attr = {}
      attr[`xs${parseInt(12 / items.length)}`] = true
      return attr
    }
  }
</script>
