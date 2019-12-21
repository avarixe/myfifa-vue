<template lang="pug">
  div
    span.font-weight-bold {{ item.player_name }}
    |&nbsp;
    | has received a {{ bookingType }}
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class BookingContent extends Vue {
    @Prop({ type: Object, required: true }) item

    get bookingType () {
      return this.item.red_card
        ? 'Red Card'
        : 'Yellow Card'
    }
  }
</script>
