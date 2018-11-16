<template>
  <v-card>
    <v-card-title>
      <div class="title">{{ round.name }}</div>

      <template v-if="!readonly">
        <v-tooltip bottom>
          <v-btn
            slot="activator"
            @click="addFixture"
            icon>
            <v-icon>mdi-plus-circle</v-icon>
          </v-btn>
          Add Fixture
        </v-tooltip>

        <stage-remove :stage="round"></stage-remove>
      </template>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="items"
      :pagination.sync="pagination"
      disable-initial-sort
      hide-actions>
      <template slot="items" slot-scope="props">
        <fixture-view
          :headers="headers"
          :fixture-data="props.item"
        ></fixture-view>
      </template>
    </v-data-table>

  </v-card>
</template>

<script>
  import StageRemove from '@/components/Competition/StageRemove'
  import FixtureView from '@/components/Competition/FixtureView'

  export default {
    components: {
      StageRemove,
      FixtureView
    },
    props: {
      round: {
        type: Object,
        required: true
      },
      readonly: Boolean
    },
    data: () => ({
      pagination: {
        rowsPerPage: -1
      }
    }),
    computed: {
      headers () {
        let headers = [
          { text: 'Home Team', value: 'home_team', sortable: false, align: 'right' },
          { text: 'Home Score', value: 'home_score', sortable: false, align: 'right' },
          { text: 'Away Score', value: 'away_score', sortable: false, align: 'left' },
          { text: 'Away Team', value: 'away_team', sortable: false, align: 'left' }
        ]
        !this.readonly && headers.unshift({ text: '', value: null, sortable: false, width: '40px' })
        return headers
      },
      items () {
        return Object.values(this.round.fixtures) || []
      }
    },
    methods: {
      addFixture () {
        this.$store.dispatch('fixture/create', {
          stageId: this.round.id,
          fixture: { home_team: '', away_team: '' }
        })
      }
    }
  }
</script>
