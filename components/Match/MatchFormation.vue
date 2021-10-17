<script>
  import { toRefs, computed } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'

  export default {
    name: 'MatchFormation',
    props: {
      match: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    setup (props) {
      const { match, readonly } = toRefs(props)

      const starters = computed(() => {
        return match.value.caps.filter(c => c.start === 0)
      })
      const substitutes = computed(() => {
        return match.value.caps.filter(c => c.start > 0)
      })
      const substitutesRowLength = computed(() => {
        return readonly.value ? 5 : 4
      })
      const firstSubstitutesRow = computed(() => {
        return substitutes.value.slice(0, substitutesRowLength.value)
      })
      const firstRowPadding = computed(() => {
        return substitutesRowLength.value - substitutes.value.length
      })
      const numExtraSubstitutesRows = computed(() => {
        return Math.floor(substitutes.value.length / substitutesRowLength.value)
      })

      const substitutesRow = i => substitutes.value.slice(
        i * substitutesRowLength.value,
        (i + 1) * substitutesRowLength.value
      )

      const { team } = useTeam()

      return {
        starters,
        substitutes,
        substitutesRowLength,
        firstSubstitutesRow,
        firstRowPadding,
        numExtraSubstitutesRows,
        substitutesRow,
        team
      }
    }
  }
</script>

<template>
  <formation-grid :players="starters">
    <template #position="{ player }">
      <cap-view
        v-if="readonly || player.subbedOut"
        :cap="player"
        :match="match"
      />
      <cap-card
        v-else
        :cap="player"
        :match="match"
      />
    </template>
    <template
      v-if="substitutes.length > 0 || !readonly"
      #footer
    >
      <v-row dense>
        <v-col
          cols="10"
          class="px-0"
        >
          <div class="text-caption text-grey lighten-2">Substitutes</div>
        </v-col>
        <v-col
          v-if="!readonly"
          cols="2"
          class="px-0"
        >
          <div class="text-caption text-grey lighten-2">vs</div>
        </v-col>
      </v-row>
      <v-row
        align="stretch"
        justify="space-around"
        dense
      >
        <v-col
          v-for="cap in firstSubstitutesRow"
          :key="cap.id"
          cols="2"
          class="text-center"
        >
          <cap-view
            v-if="readonly || cap.subbedOut"
            :cap="cap"
            :match="match"
          />
          <cap-card
            v-else
            :cap="cap"
            :match="match"
          />
        </v-col>
        <template v-if="substitutes.length < substitutesRowLength">
          <v-col
            v-for="index in firstRowPadding"
            :key="`blank-${index}`"
            cols="2"
          />
        </template>
        <v-col
          v-if="!readonly"
          cols="2"
          class="text-center"
        >
          <match-side-card
            :match="match"
            :side="match.home === team.name ? 'away' : 'home'"
          />
        </v-col>
      </v-row>
      <v-row
        v-for="row in numExtraSubstitutesRows"
        :key="row"
        align="stretch"
        justify="space-around"
        dense
      >
        <v-col
          v-for="cap in substitutesRow(row)"
          :key="cap.id"
          cols="2"
          class="text-center"
        >
          <cap-view
            v-if="readonly || cap.subbedOut"
            :cap="cap"
            :match="match"
          />
          <cap-card
            v-else
            :cap="cap"
            :match="match"
          />
        </v-col>
        <v-col
          v-for="index in (5 - substitutesRow(row).length)"
          :key="`blank-${index}`"
          cols="2"
        />
      </v-row>
    </template>
  </formation-grid>
</template>
