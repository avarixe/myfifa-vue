<template>
  <table>
    <tbody>
      <tr>
        <td
          class="font-weight-bold"
        >Origin</td>
        <td
          class="pl-1"
        >{{ transfer.origin }}</td>
      </tr>
      <tr>
        <td
          class="font-weight-bold"
        >Destination</td>
        <td
          class="pl-1"
        >
          {{ transfer.destination }}
          <span
            v-if="transfer.loan"
          >(Loan)</span>
        </td>
      </tr>
      <tr>
        <td
          class="font-weight-bold"
        >Transfer Fee</td>
        <td
          class="pl-1"
        >{{ $_formatMoney(transfer.fee) }}</td>
      </tr>
      <tr
        v-if="transfer.traded_player"
      >
        <td
          class="font-weight-bold"
        >Traded Player</td>
        <td
          class="pl-1"
        >{{ transfer.traded_player }}</td>
      </tr>
      <tr
        v-if="transfer.addon_clause"
      >
        <td
          class="font-weight-bold"
        >Add-On Clause</td>
        <td
          class="pl-1"
        >{{ transfer.addon_clause }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import {
    TeamAccessible
  } from '@/mixins'

  export default {
    mixins: [ TeamAccessible ],
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    computed: {
      transfer () {
        return this.item.data
      }
    }
  }
</script>
