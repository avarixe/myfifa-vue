<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout wrap>
      <v-flex xs12>
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">Transfer History</div>
      </v-flex>

      <v-flex xs12>
        <transfer-grid />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { TeamAccessible } from '@/mixins'
  import TransferGrid from '@/components/Transfer/TransferGrid'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    mixins: [
      TeamAccessible
    ],
    head () {
      return {
        title: `${this.team.title} - Transfer History`
      }
    },
    components: {
      TransferGrid
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
