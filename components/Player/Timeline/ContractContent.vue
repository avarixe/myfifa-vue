<template>
  <v-layout row wrap>
    <v-flex xs12>
      Wage: {{ $_formatMoney(contract.wage) }}
    </v-flex>
    <v-flex xs12>
      Signing Bonus: {{ $_formatMoney(contract.signing_bonus) }}
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