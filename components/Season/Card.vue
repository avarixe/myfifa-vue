<template>
  <v-card outlined>
    <v-card-title :class="`subtitle-1 d-block text-xs-center`">
      <span class="primary--text font-weight-light">{{ cardTitle }}</span>
    </v-card-title>

    <v-divider class="mx-3" />

    <v-card-actions>
        <v-btn
          :to="link"
          color="primary"
          text
          nuxt
          block
        >
          <badged-link
            text="View Season"
            color="primary"
          />
        </v-btn>
    </v-card-actions>

    <v-simple-table>
      <thead>
        <th />
        <th>Competitions</th>
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
          </td>

          <td>
            <nuxt-link
              :to="competition.link"
              class="black--text"
            >
              <badged-link
                :text="competition.name"
                :hint="`View ${competition.name}`"
                color="black"
              />
            </nuxt-link>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { addYears } from 'date-fns'
  import { BadgedLink } from '@/helpers'
  import { Team, Competition } from '@/models'

  @Component({
    components: {
      BadgedLink
    }
  })
  export default class SeasonCard extends Vue {
    @Prop({ type: Number, required: true }) season
    @Prop(Boolean) compact

    get team () {
      return Team.find(this.$route.params.teamId)
    }

    get competitions () {
      return Competition
        .query()
        .where('team_id', this.team.id)
        .where('season', this.season)
        .get()
    }

    get cardTitle () {
      return this.compact
        ? this.seasonLabel
        : `${this.seasonLabel} Season`
    }

    get seasonLabel () {
      let start = addYears(this.team.start_date, this.season)
      const end = addYears(start, 1)
      return `${this.$_format(start, 'YYYY')} - ${this.$_format(end, 'YYYY')}`
    }

    get link () {
      return {
        name: 'teams-teamId-seasons-season',
        params: {
          teamId: this.team.id,
          season: this.season
        }
      }
    }

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
</script>
