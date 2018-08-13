<template>
  <v-layout row wrap>
    <v-flex xs12>
      Origin: {{ transfer.origin }}
    </v-flex>
    <v-flex xs12>
      Destination: {{ transfer.destination }}
    </v-flex>
    <v-flex xs12>
      Transfer Fee: {{ $_formatMoney(transfer.fee) }}
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
      transfer () {
        return this.item.data
      }
    }
  }
</script>