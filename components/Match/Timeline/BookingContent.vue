<template>
  <div>
    <span class="font-weight-bold">{{ item.player_name }}</span>
    has received a {{ bookingType }}
  </div>
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
