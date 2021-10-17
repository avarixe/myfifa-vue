<script>
  import { ref, toRef, computed, onMounted, useContext, useStore } from '@nuxtjs/composition-api'
  import { nextTick } from 'vue'
  import { useTeam } from '@/composables'
  import { matchPositions } from '@/constants'

  export default {
    name: 'MatchOverview',
    props: {
      match: { type: Object, required: true },
      readonly: { type: Boolean, default: true }
    },
    setup (props) {
      const { team } = useTeam()
      const match = toRef(props, 'match')

      const teamPlayed = computed(() =>
        [match.value.home, match.value.away].includes(team.value.name)
      )

      const mode = ref('formation')
      const modeText = computed(() => {
        switch (mode.value) {
          case 'formation':
            return 'Formation'
          case 'lineup':
            return 'Lineup'
          default:
            return null
        }
      })

      const store = useStore()
      const avgOVR = positionType => {
        const playerIds = []

        match.value.caps.forEach(cap => {
          if (matchPositions[cap.pos] === positionType) {
            playerIds.push(cap.playerId)
          }
        })

        const totalOvr = store.$db().model('Player')
          .query()
          .whereIdIn(playerIds)
          .get()
          .reduce((sum, player) => sum + player.ovrAt(match.value.playedOn), 0)

        return Math.round(totalOvr / playerIds.length)
      }
      const defOVR = computed(() => avgOVR('DEF'))
      const midOVR = computed(() => avgOVR('MID'))
      const attOVR = computed(() => avgOVR('ATT'))

      const { $vuetify } = useContext()
      onMounted(async () => {
        if (!teamPlayed.value) {
          mode.value = 'lineup'
        }

        await nextTick()

        if (['xs', 'sm'].includes($vuetify.breakpoint.name)) {
          mode.value = 'lineup'
        }
      })

      return {
        mode,
        modeText,
        teamPlayed,
        defOVR,
        midOVR,
        attOVR
      }
    }
  }
</script>

<template>
  <v-container>
    <v-row
      v-if="!readonly"
      dense
    >
      <v-col class="text-center">
        <template v-if="teamPlayed">
          <cap-form
            v-if="match.caps.length < 11"
            :match="match"
            class="d-inline-block"
          />
          <match-squad-applier :match="match" />
          <match-squad-saver :match="match" />
        </template>
        <penalty-shootout-form
          v-if="!match.penaltyShootout"
          :match="match"
          color="indigo"
          class="d-inline-block"
        />
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
    <v-row
      v-if="teamPlayed"
      dense
    >
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
