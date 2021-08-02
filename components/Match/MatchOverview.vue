<template>
  <v-container>
    <v-row
      v-if="!readonly"
      dense
    >
      <v-col>
        <match-actions :match="match" />
      </v-col>
    </v-row>
    <v-row
      v-if="match.caps.length >= 11"
      class="text-center"
      dense
    >
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
    <v-divider class="my-2" />
    <v-row dense>
      <v-col class="d-flex align-center">
        <v-btn-toggle
          v-model="mode"
          borderless
          mandatory
          dense
          class="mr-2"
        >
          <v-btn value="formation">
            <v-icon :color="mode === 'formation' ? 'primary' : null">
              mdi-dots-hexagon
            </v-icon>
          </v-btn>
          <v-btn value="lineup">
            <v-icon :color="mode === 'lineup' ? 'primary' : null">
              mdi-format-list-bulleted
            </v-icon>
          </v-btn>
        </v-btn-toggle>
        <div :class="`subheading primary--text d-inline-block`">
          {{ modeText }}
        </div>
      </v-col>
    </v-row>
    <component
      :is="`match-${mode}`"
      :match="match"
      :readonly="readonly"
    />
  </v-container>
</template>

<script>
  import { matchPositions } from '@/constants'

  export default {
    name: 'MatchOverview',
    props: {
      match: { type: Object, required: true },
      readonly: { type: Boolean, default: true }
    },
    data: () => ({
      mode: 'formation'
    }),
    computed: {
      modeText () {
        switch (this.mode) {
          case 'formation':
            return 'Formation'
          case 'lineup':
            return 'Lineup'
          default:
            return null
        }
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
    mounted () {
      this.$nextTick(() => {
        if (['xs', 'sm'].includes(this.$vuetify.breakpoint.name)) {
          this.mode = 'lineup'
        }
      })
    },
    methods: {
      avgOVR (positionType) {
        let playerIds = []

        this.match.caps.forEach(cap => {
          if (matchPositions[cap.pos] === positionType) {
            playerIds.push(cap.playerId)
          }
        })

        const totalOvr = this.$store.$db().model('Player')
          .query()
          .whereIdIn(playerIds)
          .get()
          .reduce(
            (sum, player) => sum + player.ovrAt(this.match.playedOn),
            0
          )

        return Math.round(totalOvr / playerIds.length)
      }
    }
  }
</script>
