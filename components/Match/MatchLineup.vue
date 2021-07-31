<template>
  <v-list dense>
    <v-subheader>Players</v-subheader>
    <template v-for="cap in sortedCaps">
      <cap-card
        :key="cap.id"
        :cap="cap"
        :match="match"
      >
        <template #activator="{ on, player }">
          <v-list-item v-on="readonly ? {} : on">
            <v-list-item-icon class="font-weight-black">
              <span :style="{ width: '40px' }">{{ cap.pos }}</span>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ player.name }}</v-list-item-title>
              <cap-events
                :cap="cap"
                :match="match"
              />
            </v-list-item-content>
          </v-list-item>
        </template>
      </cap-card>
    </template>
    <template v-if="!readonly">
      <v-subheader>Teams</v-subheader>
      <opponent-card :match="match">
        <template #activator="{ on, opponent }">
          <v-list-item v-on="on">
            <v-list-item-icon class="font-weight-black">
              <span :style="{ width: '40px' }">VS</span>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ opponent }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </opponent-card>
    </template>
  </v-list>
</template>

<script>
  import { matchPositions } from '@/constants'

  const positions = Object.keys(matchPositions)

  export default {
    name: 'MatchLineup',
    props: {
      match: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    computed: {
      sortedCaps () {
        return [...this.match.caps].sort((a, b) => {
          if (a.start !== b.start) {
            return a.start - b.start
          } else {
            return positions.indexOf(a.pos) - positions.indexOf(b.pos)
          }
        })
      }
    }
  }
</script>
