<template>
  <v-list dense>
    <template v-if="teamPlayed">
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
              <v-list-item-action>
                <cap-rating
                  :cap="cap"
                  :readonly="readonly"
                />
              </v-list-item-action>
            </v-list-item>
          </template>
        </cap-card>
      </template>
    </template>
    <v-subheader>Teams</v-subheader>
    <match-side-card
      v-for="side in nonTeamSides"
      :key="side"
      :match="match"
      :side="side"
    >
      <template #activator="{ on }">
        <v-list-item v-on="readonly ? {} : on">
          <v-list-item-icon class="font-weight-black text-uppercase">
            <span :style="{ width: '40px' }">
              {{ teamPlayed ? 'vs' : side }}
            </span>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ match[side] }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </match-side-card>
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
      team () {
        return this.$store.$db().model('Team').find(this.$route.query.teamId)
      },
      teamPlayed () {
        return [this.match.home, this.match.away].includes(this.team.name)
      },
      sortedCaps () {
        return [...this.match.caps].sort((a, b) => {
          if (a.start !== b.start) {
            return a.start - b.start
          } else {
            return positions.indexOf(a.pos) - positions.indexOf(b.pos)
          }
        })
      },
      nonTeamSides () {
        const nonTeamSides = []
        const sides = ['home', 'away']
        sides.forEach(side => {
          if (this.match[side] !== this.team.name) {
            nonTeamSides.push(side)
          }
        })
        return nonTeamSides
      }
    }
  }
</script>
