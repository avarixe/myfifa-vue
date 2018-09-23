<template>
  <v-layout row wrap>
    <v-flex xs12>
      Origin: {{ transfer.origin }}
    </v-flex>
    <v-flex xs12>
      Destination: {{ transfer.destination }}
      <span v-if="transfer.loan"> (Loan)</span>
    </v-flex>
    <v-flex xs12>
      Transfer Fee: {{ $_formatMoney(transfer.fee) }}
    </v-flex>
    <v-flex v-if="transfer.traded_player" xs12>
      Traded Player: {{ transfer.traded_player }}
    </v-flex>
    <v-flex v-if="transfer.addon_clause" xs12>
      Add-On Clause: {{ transfer.addon_clause }}%
    </v-flex>
  </v-layout>
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
