<template>
  <div>
    <v-icon
      v-if="parseInt(cap.start) > 0"
      color="green"
      small
    >mdi-subdirectory-arrow-right</v-icon>
    <v-icon
      v-for="index in goals"
      :key="`goal${index}`"
      color="blue"
      small
    >mdi-soccer</v-icon>
    <v-icon
      v-for="index in assists"
      :key="`assist${index}`"
      color="light-blue accent-1"
      small
    >mdi-human-greeting</v-icon>
    <v-icon
      v-for="(color, i) in bookings"
      :key="`booking${i}`"
      :color="color"
      small
    >mdi-book</v-icon>
    <v-icon
      v-if="injured"
      color="pink"
      small
    >mdi-hospital</v-icon>
    <v-icon
      v-if="cap.subbed_out"
      color="red"
      small
    >mdi-subdirectory-arrow-left</v-icon>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class CapEvents extends Vue {
    @Prop({ type: Object, required: true }) cap
    @Prop({ type: Object, required: true }) match

    get goals () {
      return this.match.goals
        .filter(g => g.player_id === this.cap.player_id && !g.own_goal)
        .length
    }

    get assists () {
      return this.match.goals
        .filter(g => g.assist_id === this.cap.player_id)
        .length
    }

    get bookings () {
      return this.match.bookings
        .filter(b => b.player_id === this.cap.player_id)
        .map(b => b.red_card ? 'red' : 'yellow darken-2')
    }

    get injured () {
      return this.match.substitutions.some(s =>
        s.player_id === this.cap.player_id && s.injury
      )
    }
  }
</script>
