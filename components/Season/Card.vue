<template>
  <v-card outlined>
    <v-card-title class="subtitle-1 d-block text-center">
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
        View Season
      </v-btn>
    </v-card-actions>

    <v-list
      nav
      dense
      subheader
    >
      <v-subheader>Competitions</v-subheader>
      <v-list-item
        v-for="competition in competitions"
        :key="competition.id"
        :to="competition.link"
        nuxt
      >
        <v-list-item-icon>
          <v-icon
            :color="competition.statusColor"
            v-text="competition.statusIcon"
          />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ competition.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { addYears } from 'date-fns'
  import { Team, Competition } from '@/models'

  @Component
  export default class SeasonCard extends Vue {
    @Prop({ type: Number, required: true }) season
    @Prop(Boolean) compact

    get team () {
      return Team.find(this.$route.params.teamId)
    }

    get competitions () {
      return Competition
        .query()
        .with('team')
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
      let start = addYears(this.team.started_on, this.season)
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
  }
</script>
