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
      { text: 'Start Date', value: 'started_on', align: 'center' },
      { text: 'Current Date', value: 'currently_on', align: 'center' }
    ]
    search = ''

    get teams () {
      return Team.query().orderBy('id', 'desc').get()
    }
  }
</script>
