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

<script>
  export default {
    name: 'MatchFormation',
    props: {
      match: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    computed: {
      team () {
        return this.$store.$db().model('Team').find(this.$route.query.teamId)
      },
      starters () {
        return this.match.caps.filter(c => c.start === 0)
      },
      substitutes () {
        return this.match.caps.filter(c => c.start > 0)
      },
      substitutesRowLength () {
        return this.readonly ? 5 : 4
      },
      firstSubstitutesRow () {
        return this.substitutes.slice(0, this.substitutesRowLength)
      },
      firstRowPadding () {
        return this.substitutesRowLength - this.substitutes.length
      },
      numExtraSubstitutesRows () {
        return Math.floor(this.substitutes.length / this.substitutesRowLength)
      }
    },
    methods: {
      substitutesRow (i) {
        return this.substitutes.slice(
          i * this.substitutesRowLength,
          (i + 1) * this.substitutesRowLength
        )
      }
    }
  }
</script>
