<template>
  <material-card :color="color">
    <template #header>
      <span class="title font-weight-light mb-2">{{ cardTitle }}</span>

      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            v-if="compact"
            v-on="on"
            :to="seasonLink"
            nuxt
            small
            icon
          >
            <v-icon color="white">mdi-arrow-right</v-icon>
          </v-btn>
        </template>
        View Season
      </v-tooltip>
    </template>

    <p
      v-if="!compact"
      class="text-xs-center"
    >
      <v-btn
        :to="seasonLink"
        :color="color"
        outlined
        nuxt
      >View</v-btn>
    </p>

    <v-simple-table>
      <thead>
        <th>Competitions</th>
        <th />
      </thead>
      <tbody>
        <tr
          v-for="competition in competitions"
          :key="competition.id"
        >
          <td>
            <v-icon
              left
              :color="competitionStatus(competition).color"
              small
            >{{ competitionStatus(competition).icon }}</v-icon>
            {{ competition.name }}
          </td>
          <td>
            <v-btn
              :to="competitionLink(competition)"
              nuxt
              :color="color"
              outlined
            >View</v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>

  </material-card>
</template>

<script>
  import MaterialCard from '@/helpers/theme/Card'
  import { addYears } from 'date-fns'
  import {
    Team,
    Competition
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
      color: {
        type: String,
        default: 'primary'
      },
      compact: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      team () {
        return Team.find(this.$route.params.teamId)
      },
      competitions () {
        return Competition
          .query()
          .where('season', this.season)
          .get()
      },
      cardTitle () {
        return this.compact
          ? this.seasonLabel
          : `${this.seasonLabel} Season`
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
      },
      competitionStatus (competition) {
        if (competition.champion === this.team.title) {
          return {
            icon: 'mdi-trophy',
            color: 'yellow darken-2'
          }
        } else if (competition.champion) {
          return {
            icon: 'mdi-check',
            color: 'green'
          }
        } else {
          return {
            icon: 'mdi-timelapse',
            color: 'gray'
          }
        }
      }
    }
  }
</script>
