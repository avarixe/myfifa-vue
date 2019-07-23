<template>
  <v-card outlined>
    <v-card-title>
      <span class="subtitle-1 font-weight-light">{{ squad.name }}</span>

      <v-spacer />

      <squad-form :squad-data="squad">
        <template #default="{ on: dialog }">
          <v-tooltip
            bottom
            color="orange"
          >
            <template #activator="{ on: tooltip }">
              <v-btn
                text
                icon
                v-on="{ ...dialog, ...tooltip }"
              >
                <v-icon color="orange">mdi-pencil</v-icon>
              </v-btn>
            </template>
            Edit
          </v-tooltip>
        </template>
      </squad-form>

      <record-remove
        :record="squad"
        store="squads"
        :label="`Squad: ${ squad.name }`"
      />
    </v-card-title>

    <v-divider class="mx-3" />

    <v-card-text>
      <v-layout class="text-center">
        <v-flex>
          <div class="display-1 primary--text">{{ defOVR }}</div>
          <div class="subheading">DEF</div>
        </v-flex>
        <v-flex>
          <div class="display-1 success--text">{{ midOVR }}</div>
          <div class="subheading">MID</div>
        </v-flex>
        <v-flex>
          <div class="display-1 warning--text">{{ attOVR }}</div>
          <div class="subheading">ATT</div>
        </v-flex>
      </v-layout>

      <v-divider class="mx-3" />

      <formation-view :formation="squad.squad_players">
        <template #item="{ player }">
          <div class="font-weight-bold">{{ player.pos }}</div>
          <div :class="`font-weight-thin ${statusColor(player.player_id)}`">
            {{ nameOf(player.player_id) }}
          </div>
        </template>
      </formation-view>
    </v-card-text>
  </v-card>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { FormationView, RecordRemove } from '@/helpers'
  import { Player } from '@/models'
  import SquadForm from './Form'

  @Component({
    components: {
      SquadForm,
      FormationView,
      RecordRemove
    }
  })
  export default class SquadCard extends Vue {
    @Prop({ type: Object, required: true }) squad

    get defOVR () {
      return this.avgOVR('DEF')
    }

    get midOVR () {
      return this.avgOVR('MID')
    }

    get attOVR () {
      return this.avgOVR('ATT')
    }

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
    }

    nameOf (playerId) {
      const player = Player.find(playerId)
      return player ? player.name : ''
    }

    statusColor (playerId) {
      const player = Player.find(playerId)
      if (player && player.status === 'Active') {
        return ''
      } else {
        return 'red--text'
      }
    }
  }
</script>
