<template>
  <tr>
    <td
      v-for="(header, i) in headers"
      :key="i"
      :class="`text-xs-${header.align} ${cellClass(header)}`">
      <template v-if="header.value">
        <template v-if="edit">
          <v-combobox
            v-if="header.value.includes('team')"
            v-model="fixture[header.value]"
            :items="competitionTeams"
            :label="header.text"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          ></v-combobox>
          <v-text-field
            v-else
            v-model="fixture[header.value]"
            :label="header.text"
          ></v-text-field>
        </template>
        <template v-else>
          {{ fixtureData[header.value] }}
        </template>
      </template>
      <template v-else>
        <v-btn @click="edit = !edit" small icon>
          <v-icon
            :color="edit ? 'primary' : 'orange'"
            small
          >mdi-{{ edit ? 'content-save' : 'pencil' }}</v-icon>
        </v-btn>
      </template>
    </td>
  </tr>
</template>

<script>
  import CompetitionAccessible from '@/mixins/CompetitionAccessible'

  export default {
    mixins: [ CompetitionAccessible ],
    props: {
      fixtureData: {
        type: Object,
        required: true
      },
      headers: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      edit: false,
      fixture: {}
    }),
    watch: {
      edit (val) {
        if (val) {
          this.fixture = { ...this.fixtureData }
        } else {
          this.$store.dispatch('fixture/update', this.fixture)
        }
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
