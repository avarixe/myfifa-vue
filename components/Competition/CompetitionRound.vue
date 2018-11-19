<template>
  <v-card>
    <v-card-title>
      <div class="title">
        <template v-if="edit">
          <v-text-field
            v-model="stage.name"
            :rules="$_validate('Stage Name', ['required'])"
            class="d-inline-block"
            @click.stop
          ></v-text-field>
        </template>
        <template v-else>
          {{ round.name }}
        </template>
      </div>

      <template v-if="!readonly">
        <edit-mode-button
          :mode="edit"
          :changed="stageChanged"
          v-on:toggle-mode="edit = !edit"
        ></edit-mode-button>

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
      <template slot="headers" slot-scope="props">
        <th
          v-for="(header, i) in headers"
          :key="i"
          :class="`text-xs-${header.align}`"
          :width="header.width">
          <template v-if="header.value">
            {{ header.text }}
          </template>
          <v-tooltip v-else right>
            <v-btn
              slot="activator"
              @click="override = !override"
              icon>
              <v-icon>mdi-playlist-edit</v-icon>
            </v-btn>
            Edit All
          </v-tooltip>
        </th>
      </template>
      <template slot="items" slot-scope="props">
        <fixture-view
          :headers="headers"
          :fixture-data="props.item"
          :override="override"
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
      stage: {},
      edit: false,
      override: false,
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
      },
      stageChanged () {
        return this.stage.name !== this.round.name
      }
    },
    watch: {
      edit (val) {
        if (val) {
          const { id, name } = this.round
          this.stage = { id, name }
        } else if (this.stageChanged) {
          this.$store.dispatch('stage/update', this.stage)
        }
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
