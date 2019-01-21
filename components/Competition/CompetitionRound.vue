<template>
  <v-card>
    <v-card-title>
      <div
        class="title"
      >
        <template
          v-if="edit"
        >
          <v-text-field
            v-model="stage.name"
            :rules="$_validate('Stage Name', ['required'])"
            class="d-inline-block"
            @click.stop
          />
        </template>
        <template
          v-else
        >{{ round.name }}</template>
      </div>

      <template
        v-if="!readonly"
      >
        <edit-mode-button
          :mode="edit"
          :changed="stageChanged"
          @toggle-mode="edit = !edit"
        />

        <v-tooltip
          bottom
        >
          <v-btn
            slot="activator"
            icon
            @click="addFixture"
          >
            <v-icon
              v-text="'mdi-plus-circle'"
            />
          </v-btn>
          Add Fixture
        </v-tooltip>

        <stage-remove
          :stage="round"
        />
      </template>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="items"
      :pagination.sync="pagination"
      disable-initial-sort
      hide-actions
    >
      <template
        slot="headers"
        slot-scope="props"
      >
        <th
          v-for="(header, i) in headers"
          :key="i"
          :class="`text-xs-${header.align}`"
          :width="header.width"
        >
          <template
            v-if="header.value"
          >{{ header.text}}</template>
          <v-tooltip
            v-else
            right
          >
            <v-btn
              slot="activator"
              icon
              @click="override = !override"
            >
              <v-icon
                v-text="'mdi-playlist-edit'"
              />
            </v-btn>
            Edit All
          </v-tooltip>
        </th>
      </template>

      <template
        slot="items"
        slot-scope="props"
      >
        <fixture-view
          :headers="headers"
          :fixture-data="props.item"
          :override="override"
        />
      </template>
    </v-data-table>

  </v-card>
</template>

<script>
  import EditModeButton from '@/components/EditModeButton'
  import StageRemove from './StageRemove'
  import FixtureView from './FixtureView'

  export default {
    components: {
      EditModeButton,
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
          {
            text: 'Home Team',
            value: 'home_team',
            sortable: false,
            align: 'right'
          },
          {
            text: 'Home Score',
            value: 'home_score',
            sortable: false,
            align: 'right'
          },
          {
            text: 'Away Score',
            value: 'away_score',
            sortable: false,
            align: 'left'
          },
          {
            text: 'Away Team',
            value: 'away_team',
            sortable: false,
            align: 'left'
          }
        ]
        !this.readonly && headers.unshift({
          text: '',
          value: null,
          sortable: false,
          width: '40px'
        })
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
          this.$store.dispatch('entities/stages/UPDATE', this.stage)
        }
      }
    },
    methods: {
      addFixture () {
        this.$store.dispatch('entities/fixtures/CREATE', {
          stageId: this.round.id,
          fixture: { home_team: '', away_team: '' }
        })
      }
    }
  }
</script>
