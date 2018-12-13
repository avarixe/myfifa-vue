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
        { resource: 'Matches',      handler: this.getMatches },
        { resource: 'Squads',       handler: this.getSquads },
        { resource: 'Competitions', handler: this.getCompetitions }
      ]

      for (let i = 0; i < loaders.length; i++) {
        await this.loadData(loaders[i])
        this.value = 100 / loaders.length * (i + 1)
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
        getPlayers: 'entities/players/FETCH',
        getMatches: 'entities/matches/FETCH',
        getSquads: 'entities/squads/FETCH',
        getCompetitions: 'entities/competitions/FETCH'
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
