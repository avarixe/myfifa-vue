<script>
  import { toRef, computed, useStore } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'

  export default {
    name: 'SeasonCard',
    props: {
      season: { type: Number, required: true }
    },
    setup (props) {
      const { team, seasonLabel } = useTeam()
      const store = useStore()
      const season = toRef(props, 'season')
      const competitions = computed(() =>
        store.$db().model('Competition')
          .query()
          .with('team')
          .where('teamId', team.value.id)
          .where('season', season.value)
          .get()
      )

      const link = computed(() => ({
        name: 'teams-teamId-seasons-season',
        params: {
          teamId: team.value.id,
          season: season.value
        }
      }))

      return {
        seasonLabel,
        competitions,
        link
      }
    }
  }
</script>

<template>
  <v-card>
    <v-toolbar
      color="blue"
      dark
      dense
    >
      <v-toolbar-title class="font-weight-light">
        {{ seasonLabel(season) }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        :to="link"
        dark
        text
        nuxt
      >
        View Season
      </v-btn>
    </v-toolbar>
    <v-list
      nav
      dense
    >
      <v-subheader>Competitions</v-subheader>
      <v-list-item
        v-for="competition in competitions"
        :key="competition.id"
        :to="competition.link"
        nuxt
      >
        <v-list-item-icon>
          <v-icon :color="competition.statusColor">
            {{ competition.statusIcon }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ competition.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>
