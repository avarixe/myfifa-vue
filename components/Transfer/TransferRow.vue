<template>
  <tr>
    <td>{{ $_format($_parse(transfer.effective_date), 'MMM DD, YYYY') }}</td>
    <td>{{ transfer.player.name }}</td>
    <td>{{ transfer.origin }}</td>
    <td>{{ transfer.destination }}</td>
    <td :class="`${transferOut ? 'green' : 'red'}--text`">
      {{ $_formatMoney(transfer.fee) }}
    </td>
  </tr>
</template>

<script>
  import { TeamAccessible } from '@/mixins'

  export default {
    mixins: [
      TeamAccessible
    ],
    props: {
      transfer: {
        type: Object,
        required: true
      }
    },
    computed: {
      transferOut () {
        return this.transfer.origin === this.team.title
      }
    }
  }
</script>
