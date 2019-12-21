<template lang="pug">
  v-card
    v-card-text
      client-only
        v-data-table(
          :headers="headers"
          :items="teams"
          item-key="id"
          no-data-text="No Teams Recorded"
        )
          template(#item.title="{ item }")
            v-btn(
              :to="item.link"
              nuxt
              text
              color="primary"
            ) {{ item.title }}
          template(#item.badge_path="{ item }")
            v-img.text-center(
              v-if="item.badge_path"
              :src="item.badgeUrl"
              height="32px"
              width="32px"
              contain
            )
          template(#item.started_on="{ item }")
            | {{ item.started_on | formatDate }}
          template(#item.currently_on="{ item }")
            | {{ item.currently_on | formatDate }}
</template>

<script>
  import { Team } from '@/models'

  export default {
    name: 'TeamGrid',
    data: () => ({
      headers: [
        { text: 'Team Name', value: 'title', align: 'center' },
        { text: 'Badge', value: 'badge_path', align: 'center', width: '32px', sortable: false },
        { text: 'Start Date', value: 'started_on', align: 'center' },
        { text: 'Current Date', value: 'currently_on', align: 'center' }
      ],
      search: ''
    }),
    computed: {
      teams () {
        return Team.query().orderBy('id', 'desc').get()
      }
    }
  }
</script>
