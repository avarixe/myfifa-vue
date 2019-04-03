<template>
  <material-card>
    <template
      slot="header"
    >
      <span
        class="title font-weight-light mb-2"
      >{{ seasonLabel }}</span>

      <v-tooltip
        bottom
      >
        <v-btn
          slot="activator"
          :to="seasonLink"
          nuxt
          small
          icon
        >
          <v-icon
            color="white"
          >mdi-arrow-right</v-icon>
        </v-btn>
        View Season
      </v-tooltip>
    </template>

    <v-list
      dense
    >
      <v-subheader>Competitions</v-subheader>
      <v-list-tile
        v-for="(competition, i) in competitions"
        :key="i"
        :to="competitionLink(competition)"
        class="elevation-1"
      >
        <v-list-tile-title>
          <v-icon
            color="blue"
            small
            left
          >mdi-arrow-right</v-icon>
          {{ competition.name }}
        </v-list-tile-title>
        <v-list-tile-avatar
          v-if="competition.champion === team.title"
        >
          <v-icon
            color="yellow darken-2"
          >mdi-trophy</v-icon>
        </v-list-tile-avatar>
      </v-list-tile>
    </v-list>

  </material-card>
</template>

<script>
  import MaterialCard from '@/components/theme/Card'
  import {
    addYears
  } from 'date-fns'
  import {
    Team
  } from '@/models'

  export default {
    components: {
      MaterialCard
    },
    props: {
      season: {
        type: Number,
        required: true
      },
      competitions: {
        type: Array,
        required: true
      }
    },
    computed: {
      team () {
        return Team.find(this.$route.params.teamId)
      },
      seasonLabel () {
        let start = addYears(this.team.start_date, this.season)
        const end = addYears(start, 1)
        return `${this.$_format(start, 'YYYY')} - ${this.$_format(end, 'YYYY')}`
      },
      seasonLink () {
        return {
          name: 'teams-teamId-seasons-season',
          params: {
            teamId: this.team.id,
            season: this.season
          }
        }
      }
    },
    methods: {
      competitionLink (competition) {
        return {
          name: 'teams-teamId-competitions-competitionId',
          params: {
            teamId: this.team.id,
            competitionId: competition.id
          }
        }
      }
    }
  }
</script>

<style scoped>
  #app .v-card,
  #app .v-list {
    background-color: rgba(255, 255, 255, 0.5);
  }
</style>
