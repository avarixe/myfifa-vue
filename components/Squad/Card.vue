<template>
  <v-card outlined>
    <v-card-title>
      <span class="subtitle-1 font-weight-light">{{ squad.name }}</span>

      <v-spacer />

      <squad-form :squad-data="squad" >
        <template #default="{ on: dialog }">
          <v-tooltip
            bottom
            color="orange"
          >
            <template #activator="{ on: tooltip }">
              <v-btn
                v-on="{ ...dialog, ...tooltip }"
                text
                icon
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
      <v-layout class="text-xs-center">
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

      <formation-view :formation="squadPlayers" />
    </v-card-text>
  </v-card>
</template>

<script>
  import { FormationView, RecordRemove } from '@/helpers'
  import { Player } from '@/models'
  import { positions } from '@/models/Match'
  import SquadForm from './Form'

  export default {
    components: {
      SquadForm,
      FormationView,
      RecordRemove
    },
    props: {
      squad: {
        type: Object,
        required: true
      }
    },
    computed: {
      squadPlayers () {
        return this.squad.positions_list.map((pos, i) => ({
          pos: pos,
          player_id: this.squad.players_list[i]
        }))
      },
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

        this.squad.positions_list.forEach((pos, i) => {
          if (positions[pos] === positionType) {
            playerIds.push(parseInt(this.squad.players_list[i]))
          }
        })

        const totalOvr = Player
          .query()
          .whereIdIn(playerIds)
          .sum('ovr')

        return Math.round(totalOvr / playerIds.length)
      }
    }
  }
</script>
