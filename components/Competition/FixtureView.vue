<template>
  <tr>
    <td
      v-for="(header, i) in headers"
      :key="i"
      :class="`text-xs-${header.align} ${cellClass(header)}`"
    >
      <template
        v-if="header.value"
      >
        <template
          v-if="edit"
        >
          <v-combobox
            v-if="header.value.includes('team')"
            v-model="fixture[header.value]"
            :items="competitionTeams"
            :label="header.text"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          />
          <v-text-field
            v-else
            v-model="fixture[header.value]"
            :label="header.text"
          />
        </template>
        <template
          v-else
        >{{ fixtureData[header.value] }}</template>
      </template>

      <template v-else>
        <edit-mode-button
          :mode="edit"
          :changed="fixtureChanged"
          @toggle-mode="edit = !edit"
          dir="right"
        />
      </template>
    </td>
  </tr>
</template>

<script>
  import EditModeButton from '@/components/EditModeButton'
  import CompetitionAccessible from '@/mixins/CompetitionAccessible'

  export default {
    components: {
      EditModeButton
    },
    mixins: [ CompetitionAccessible ],
    props: {
      fixtureData: {
        type: Object,
        required: true
      },
      headers: {
        type: Array,
        required: true
      },
      override: Boolean
    },
    data: () => ({
      edit: false,
      fixture: {}
    }),
    computed: {
      fixtureChanged () {
        return this.headers.some(header =>
          this.fixture[header.value] !== this.fixtureData[header.value]
        )
      }
    },
    watch: {
      edit (val) {
        if (val) {
          this.fixture = { ...this.fixtureData }
        } else if (this.fixtureChanged) {
          this.$store.dispatch('entities/fixtures/UPDATE', this.fixture)
        }
      },
      override (val) {
        this.edit = true
      }
    },
    methods: {
      cellClass (header) {
        switch (header.value) {
          case 'home_team':
          case 'home_score':
            return this.teamClass(this.fixtureData.home_team)
          case 'away_team':
          case 'away_score':
            return this.teamClass(this.fixtureData.away_team)
          default:
            return ''
        }
      }
    }
  }
</script>
