<script>
  import { toRef, computed, useStore } from '@nuxtjs/composition-api'

  export default {
    name: 'SquadCard',
    props: {
      squad: { type: Object, required: true }
    },
    setup (props) {
      const squad = toRef(props, 'squad')
      const store = useStore()
      const avgOVR = positionType => {
        let playerIds = []

        squad.value.squadPlayers.forEach(squadPlayer => {
          if (squadPlayer.positionType === positionType) {
            playerIds.push(squadPlayer.playerId)
          }
        })

        const totalOvr = store.$db().model('Player')
          .query()
          .whereIdIn(playerIds)
          .sum('ovr')

        return Math.round(totalOvr / (playerIds.length || 1))
      }

      const defOVR = computed(() => avgOVR('DEF'))
      const midOVR = computed(() => avgOVR('MID'))
      const attOVR = computed(() => avgOVR('ATT'))

      const nameOf = playerId => {
        const player = store.$db().model('Player').find(playerId)
        return player ? player.name : ''
      }

      const statusColor = playerId => {
        const player = store.$db().model('Player').find(playerId)
        return player?.status === 'Active' ? '' : 'red--text'
      }

      return {
        defOVR,
        midOVR,
        attOVR,
        nameOf,
        statusColor
      }
    }
  }
</script>

<template>
  <v-card>
    <v-toolbar
      color="primary"
      dense
    >
      <v-toolbar-title class="font-weight-light white--text">
        {{ squad.name }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-row
        class="text-center"
        dense
      >
        <v-col cols="12">
          <squad-form
            :record="squad"
            color="orange"
            title-class="grey--text text--darken-4"
            class="d-inline-block"
          >
            <template #activator="{ on }">
              <tooltip-button
                label="Edit"
                icon="mdi-pencil"
                color="orange"
                :on="on"
              />
            </template>
          </squad-form>
          <record-remove
            :record="squad"
            store="squads"
            :label="`Squad: ${ squad.name }`"
            small
          />
        </v-col>
        <v-col>
          <div class="text-h4 primary--text">{{ defOVR }}</div>
          <div class="subheading">DEF</div>
        </v-col>
        <v-col>
          <div class="text-h4 success--text">{{ midOVR }}</div>
          <div class="subheading">MID</div>
        </v-col>
        <v-col>
          <div class="text-h4 warning--text">{{ attOVR }}</div>
          <div class="subheading">ATT</div>
        </v-col>
      </v-row>
      <v-divider class="mx-3" />
      <formation-grid :players="squad.squadPlayers">
        <template #position="{ player, pos }">
          <div class="font-weight-bold">{{ pos }}</div>
          <scroll-text
            :text="nameOf(player.playerId)"
            :class="statusColor(player.playerId)"
            :style="{ fontSize: '0.8em', lineHeight: 1.5 }"
          />
        </template>
      </formation-grid>
    </v-card-text>
  </v-card>
</template>
