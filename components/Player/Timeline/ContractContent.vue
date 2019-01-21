<template>
  <table>
    <tbody>
      <tr>
        <td
          class="font-weight-bold"
          v-text="'Wage'"
        />
        <td
          class="pl-1"
          v-text="$_formatMoney(contract.wage)"
        />
      </tr>
      <tr>
        <td
          class="font-weight-bold"
          v-text="'Signing Bonus'"
        />
        <td
          class="pl-1"
          v-text="$_formatMoney(contract.signing_bonus)"
        />
      </tr>
      <tr
        v-if="contract.performance_bonus"
      >
        <td
          class="font-weight-bold"
          v-text="'Performance Bonus'"
        />
        <td
          class="pl-1"
          v-text="`${$_formatMoney(contract.performance_bonus)} if ${contract.bonus_req} ${contract.bonus_req_type}`"
        />
      </tr>
      <tr
        v-if="contract.release_clause"
      >
        <td
          class="font-weight-bold"
          v-text="'Release Clause'"
        />
        <td
          class="pl-1"
          v-text="$_formatMoney(contract.release_clause)"
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
      contract () {
        return this.item.data
      }
    }
  }
</script>
