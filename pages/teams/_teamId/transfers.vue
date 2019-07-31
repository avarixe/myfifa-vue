<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">Transfer History</div>
      </v-col>

      <v-col cols="12">
        <transfer-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import TransferGrid from '@/components/Transfer/Grid'

  @Component({
    components: {
      TransferGrid
    },
    transition: 'fade-transition'
  })
  export default class TransfersPage extends mixins(TeamAccessible) {
    layout = () => 'default'
    middleware = () => 'authenticated'

    head () {
      return {
        title: `${this.team.title} - Transfer History`
      }
    }

    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('players/FETCH', { teamId: params.teamId }),
        store.dispatch('transfers/TEAM_FETCH', { teamId: params.teamId })
      ])
    }

    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
