<template>
  <div>
    <span
      class="font-weight-bold"
      v-text="item.player_name"
    />
    has received a {{ bookingType }}
  </div>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    computed: {
      bookingType () {
        return this.item.red_card
          ? 'Red Card'
          : 'Yellow Card'
      }
    }
  }
</script>
