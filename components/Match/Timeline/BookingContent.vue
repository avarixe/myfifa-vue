<template lang="pug">
  div
    span.font-weight-bold {{ item.player_name }}
    |&nbsp;
    | has received a {{ bookingType }}
</template>

<script>
  export default {
    name: 'BookingContent',
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    computed: {
      bookingType () {
        return this.item.red_card ? 'Red Card' : 'Yellow Card'
      }
    }
  }
</script>
