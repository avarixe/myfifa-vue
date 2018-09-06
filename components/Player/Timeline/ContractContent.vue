<template>
  <v-layout row wrap>
    <v-flex xs12>
      Wage: {{ $_formatMoney(contract.wage) }}
    </v-flex>
    <v-flex xs12>
      Signing Bonus: {{ $_formatMoney(contract.signing_bonus) }}
    </v-flex>
    <v-flex v-if="contract.performance_bonus" xs12>
      Performance Bonus: {{ $_formatMoney(contract.performance_bonus) }} if {{ contract.bonus_req }} {{ contract.bonus_req_type }}
    </v-flex>
    <v-flex v-if="contract.release_clause" xs12>
      Release Clause: {{ $_formatMoney(contract.release_clause) }}
    </v-flex>
  </v-layout>
</template>

<script>
  import TeamAction from '@/mixins/TeamAction'

  export default {
    mixins: [
      TeamAction
    ],
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    computed: {
      contract () {
        console.log(this)
        return this.item.data
      }
    }
  }
</script>
