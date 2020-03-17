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
          >
            <template #default="{ on }">
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
          <div class="display-1 primary--text">{{ defOVR }}</div>
          <div class="subheading">DEF</div>
        </v-col>
        <v-col>
          <div class="display-1 success--text">{{ midOVR }}</div>
          <div class="subheading">MID</div>
        </v-col>
        <v-col>
          <div class="display-1 warning--text">{{ attOVR }}</div>
          <div class="subheading">ATT</div>
        </v-col>
      </v-row>
      <v-divider class="mx-3" />
      <formation-view :formation="squad.squad_players">
        <template #item="{ player }">
          <div class="font-weight-bold">{{ player.pos }}</div>
          <div :class="statusColor(player.player_id)">
            {{ nameOf(player.player_id) }}
          </div>
        </template>
      </formation-view>
    </v-card-text>
  </v-card>
</template>

<script>
  import { Player } from '@/models'
  import SquadForm from './Form'

  export default {
    name: 'SquadCard',
    components: {
      SquadForm
    },
    props: {
      squad: { type: Object, required: true }
    },
    computed: {
      defOVR () {
        return this.avgOVR('DEF')
      },
      midOVR () {
        return this.avgOVR('MID')
      },
      attOVR () {
        return this.avgOVR('ATT')
      }
    },
    methods: {
      avgOVR (positionType) {
        let playerIds = []

        this.squad.squad_players.forEach(squadPlayer => {
          if (squadPlayer.positionType === positionType) {
            playerIds.push(squadPlayer.player_id)
          }
        })

        const totalOvr = Player
          .query()
          .whereIdIn(playerIds)
          .sum('ovr')

        return Math.round(totalOvr / playerIds.length)
      },
      nameOf (playerId) {
        const player = Player.find(playerId)
        return player ? player.name : ''
      },
      statusColor (playerId) {
        const player = Player.find(playerId)
        if (player && player.status === 'Active') {
          return ''
        } else {
          return 'red--text'
        }
      }
    }
  }
</script>
