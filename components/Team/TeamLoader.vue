<template>
  <div class="loading-page">
    <v-progress-circular
      :size="200"
      :width="15"
      color="primary"
      :value="value"
      class="text-xs-center primary--text"
    >{{ status }}</v-progress-circular>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    props: {
      team: Object
    },
    data: () => ({
      value: 0,
      loaded: false,
      status: 'Loading Team Data'
    }),
    async mounted () {
      const loaders = [
        { resource: 'Players',      handler: this.getPlayers },
        { resource: 'Contracts',    handler: this.getContracts },
        { resource: 'Transfers',    handler: this.getTransfers },
        { resource: 'Loans',        handler: this.getLoans },
        { resource: 'Injuries',     handler: this.getInjuries },
        { resource: 'Matches',      handler: this.getMatches },
        { resource: 'Squads',       handler: this.getSquads },
        { resource: 'Competitions', handler: this.getCompetitions },
        { resource: 'Stages',       handler: this.getStages }
      ]

      for (let i = 0; i < loaders.length; i++) {
        this.value = 100 / loaders.length * (i + 1)
        await this.loadData(loaders[i])
      }

      this.loaded = true
    },
    watch: {
      loaded (val) {
        this.$emit('loaded')
      }
    },
    methods: {
      ...mapActions({
        getPlayers: 'players/FETCH',
        getContracts: 'contracts/TEAM_FETCH',
        getTransfers: 'transfers/TEAM_FETCH',
        getLoans: 'loans/TEAM_FETCH',
        getInjuries: 'injuries/TEAM_FETCH',
        getMatches: 'matches/FETCH',
        getSquads: 'squads/FETCH',
        getCompetitions: 'competitions/FETCH',
        getStages: 'stages/TEAM_FETCH'
      }),
      async loadData ({ resource, handler }) {
        this.status = `Loading ${resource}...`
        await handler({ teamId: this.team.id })
      }
    }
  }
</script>

<style scoped>
  .loading-page {
    display: flex;
    position: fixed;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.5);
    z-index: 2;
  }
</style>
