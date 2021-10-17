<script>
  import { toRef, computed } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'
  import { matchPositions } from '@/constants'

  export default {
    name: 'MatchLineup',
    props: {
      match: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    setup (props) {
      const { team } = useTeam()
      const match = toRef(props, 'match')

      const teamPlayed = computed(() =>
        [match.value.home, match.value.away].includes(team.value.name)
      )

      const positions = Object.keys(matchPositions)
      const sortedCaps = computed(() => {
        return [...match.value.caps].sort((a, b) => {
          if (a.start !== b.start) {
            return a.start - b.start
          } else {
            return positions.indexOf(a.pos) - positions.indexOf(b.pos)
          }
        })
      })

      const nonTeamSides = computed(() => {
        const nonTeamSides = []
        const sides = ['home', 'away']
        sides.forEach(side => {
          if (match.value[side] !== team.value.name) {
            nonTeamSides.push(side)
          }
        })
        return nonTeamSides
      })

      return {
        teamPlayed,
        sortedCaps,
        nonTeamSides
      }
    }
  }
</script>

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
