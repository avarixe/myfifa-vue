<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="teams"
        item-key="id"
        no-data-text="No Teams Recorded"
      >
        <template #[`item.name`]="{ item }">
          <v-btn
            :to="item.link"
            nuxt
            text
            color="primary"
          >
            {{ item.name }}
          </v-btn>
        </template>
        <template #[`item.badgePath`]="{ item }">
          <v-img
            v-if="item.badgePath"
            :src="badgeUrl(item)"
            height="32px"
            width="32px"
            contain
            class="text-center"
          />
          <v-tooltip
            v-else
            bottom
          >
            <template #activator="{ on }">
              <v-icon v-on="on">mdi-shield-off-outline</v-icon>
            </template>
            <span>Edit Team to upload Badge</span>
          </v-tooltip>
        </template>
        <template #[`item.startedOn`]="{ item }">
          {{ item.startedOn | formatDate }}
        </template>
        <template #[`item.currentlyOn`]="{ item }">
          {{ item.currentlyOn | formatDate }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'TeamGrid',
    data: () => ({
      headers: [
        { text: 'Name', value: 'name', align: 'center' },
        { text: 'Badge', value: 'badgePath', align: 'center', width: '32px', sortable: false },
        { text: 'Start Date', value: 'startedOn', align: 'center' },
        { text: 'Current Date', value: 'currentlyOn', align: 'center' }
      ],
      search: ''
    }),
    computed: {
      teams () {
        return this.$store.$db().model('Team')
          .query()
          .orderBy('id', 'desc')
          .get()
      }
    },
    methods: {
      badgeUrl (team) {
        return team.badgePath
          ? `${this.$config.baseURL}${team.badgePath}`
          : null
      }
    }
  }
</script>
