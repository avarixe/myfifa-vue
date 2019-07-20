<template>
  <v-card flat>
    <v-card-title>
      <inline-field
        :key="key"
        :item="round"
        attribute="name"
        :label="round.name"
        :readonly="readonly"
        @close="updateStageAttribute(round.id, 'name', $event)"
        display-class="font-weight-light"
      />

      <v-spacer />

      <template v-if="!readonly">
        <fixture-form :stage="round" />
        <record-remove
          :record="round"
          store="stages"
          :label="round.name"
        />
      </template>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="-1"
      disable-sort
      hide-default-footer
    >
      <template #item.home_team="{ item }">
        <span :class="teamClass(item.home_team)">{{ item.home_team }}</span>
      </template>
      <template #item.away_team="{ item }">
        <span :class="teamClass(item.away_team)">{{ item.away_team }}</span>
      </template>
      <template #item.actions="{ item }">
        <fixture-form
          :stage="round"
          :fixture-data="item"
        >
          <template #default="{ on }">
            <v-tooltip bottom>
              <template #activator="{ on: tooltip }">
                <v-btn
                  v-on="{ ...on, ...tooltip }"
                  icon
                >
                  <v-icon color="orange">mdi-pencil</v-icon>
                </v-btn>
              </template>
              Edit Fixture
            </v-tooltip>
          </template>
        </fixture-form>
        <record-remove
          :record="item"
          store="fixtures"
          label="Fixture"
        />
      </template>
    </v-data-table>

  </v-card>
</template>

<script>
  import { mixins, Component, Prop } from 'nuxt-property-decorator'
  import { CompetitionAccessible } from '@/mixins'
  import { InlineField, RecordRemove } from '@/helpers'
  import FixtureForm from '@/components/Fixture/Form'

  @Component({
    components: {
      InlineField,
      RecordRemove,
      FixtureForm
    }
  })
  export default class RoundStage extends mixins(CompetitionAccessible) {
    @Prop({ type: Object, required: true }) round
    @Prop(Boolean) readonly

    key = 0

    get items () {
      return Object.values(this.round.fixtures) || []
    }

    get headers () {
      const headers = [
        { text: 'Home Team', value: 'home_team', align: 'end' },
        { text: 'Score', value: 'score', align: 'center' },
        { text: 'Away Team', value: 'away_team' }
      ]

      if (!this.readonly) {
        headers.push({
          text: '',
          value: 'actions',
          width: 120
        })
      }

      return headers
    }

    async updateStageAttribute (stageId, attribute, value) {
      try {
        await this.$store.dispatch('stages/UPDATE', {
          id: stageId,
          [attribute]: value
        })
      } catch (e) {
        this.key++
        this.$store.commit('broadcaster/ANNOUNCE', {
          message: e.message,
          color: 'red'
        })
      }
    }
  }
</script>
