<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="teams"
        item-key="id"
        no-data-text="No Teams Recorded"
      >
        <template #item.title="{ item }">
          <v-btn
            :to="item.link"
            nuxt
            text
            color="primary"
          >
            {{ item.title }}
          </v-btn>
        </template>
        <template #item.badge_path="{ item }">
          <v-img
            v-if="item.badge_path"
            :src="item.badgeUrl"
            height="32px"
            width="32px"
            contain
            class="text-center"
          />
        </template>
        <template #item.started_on="{ item }">
          {{ $_format($_parse(item.started_on), 'MMM DD, YYYY') }}
        </template>
        <template #item.currently_on="{ item }">
          {{ $_format($_parse(item.currently_on), 'MMM DD, YYYY') }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { Vue, Component } from 'nuxt-property-decorator'
  import { Team } from '@/models'

  @Component
  export default class TeamGrid extends Vue {
    headers = [
      { text: 'Team Name', value: 'title', align: 'center' },
      { text: 'Badge', value: 'badge_path', align: 'center', width: '32px', sortable: false },
      { text: 'Start Date', value: 'started_on', align: 'center' },
      { text: 'Current Date', value: 'currently_on', align: 'center' }
    ]
    search = ''

    get teams () {
      return Team.query().orderBy('id', 'desc').get()
    }
  }
</script>
