<template>
  <table>
    <tbody>
      <tr>
        <td
          class="font-weight-bold"
          v-text="'Origin'"
        />
        <td
          class="pl-1"
          v-text="transfer.origin"
        />
      </tr>
      <tr>
        <td
          class="font-weight-bold"
          v-text="'Destination'"
        />
        <td
          class="pl-1"
        >
          {{ transfer.destination }}
          <span
            v-if="transfer.loan"
            v-text="'(Loan)'"
          />
        </td>
      </tr>
      <tr>
        <td
          class="font-weight-bold"
          v-text="'Transfer Fee'"
        />
        <td
          class="pl-1"
          v-text="$_formatMoney(transfer.fee)"
        />
      </tr>
      <tr
        v-if="transfer.traded_player"
      >
        <td
          class="font-weight-bold"
          v-text="'Traded Player'"
        />
        <td
          class="pl-1"
          v-text="transfer.traded_player"
        />
      </tr>
      <tr
        v-if="transfer.addon_clause"
      >
        <td
          class="font-weight-bold"
          v-text="'Add-On Clause'"
        />
        <td
          class="pl-1"
          v-text="transfer.addon_clause"
        />
      </tr>
    </tbody>
  </table>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'

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
