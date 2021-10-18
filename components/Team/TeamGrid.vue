<script>
  import { ref, computed, useContext, useStore } from '@nuxtjs/composition-api'

  export default {
    name: 'TeamGrid',
    setup () {
      const store = useStore()
      const teams = computed(() =>
        store.$db().model('Team').query().orderBy('id', 'desc').get()
      )

      const { $config } = useContext()
      const badgeUrl = team => {
        return team.badgePath
          ? `${$config.baseURL.replace(/\/api/, '')}${team.badgePath}`
          : null
      }

      const search = ref('')

      return {
        teams,
        search,
        badgeUrl,
        headers: [
          { text: 'Name', value: 'name', align: 'center' },
          { text: 'Badge', value: 'badgePath', align: 'center', width: '32px', sortable: false },
          { text: 'Start Date', value: 'startedOn', align: 'center' },
          { text: 'Current Date', value: 'currentlyOn', align: 'center' }
        ]
      }
    }
  }
</script>

<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="teams"
        item-key="id"
        no-data-text="No Teams Recorded"
      >
        <template #item.name="{ item }">
          <v-btn
            :to="item.link"
            nuxt
            text
            color="primary"
          >
            {{ item.name }}
          </v-btn>
        </template>
        <template #item.badgePath="{ item }">
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
        <template #item.startedOn="{ item }">
          {{ item.startedOn | formatDate }}
        </template>
        <template #item.currentlyOn="{ item }">
          {{ item.currentlyOn | formatDate }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
