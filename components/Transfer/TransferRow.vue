<template>
  <tr>
    <td
      v-text="$_format($_parse(transfer.effective_date), 'MMM DD, YYYY')"
    />
    <td
      v-text="transfer.player.name"
    />
    <td
      v-text="transfer.origin"
    />
    <td
      v-text="transfer.destination"
    />
    <td
      :class="`${transferOut ? 'green' : 'red'}--text`"
      v-text="$_formatMoney(transfer.fee)"
    />
  </tr>
</template>

<script>
  import {
    TeamAccessible
  } from '@/mixins'

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
