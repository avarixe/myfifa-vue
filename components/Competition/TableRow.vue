<template>
  <tr>
    <td
      v-for="(header, i) in headers"
      :key="i"
      :class="`text-xs-${header.align}`">
      <template v-if="header.value">
        <template v-if="edit && header.type">
          <v-combobox
            v-if="header.value === 'name'"
            v-model="row.name"
            :items="competitionTeams"
            label="Name"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          ></v-combobox>
          <v-text-field
            v-else-if="header.type === 'number'"
            v-model.number="row[header.value]"
            type="number"
            :label="header.text"
            :autofocus="i === 0"
          ></v-text-field>
          <v-text-field
            v-else
            v-model="row[header.value]"
            :label="header.text"
            :autofocus="i === 0"
          ></v-text-field>
        </template>
        <template v-else>
          <span :class="teamClass(rowData.name)">
            {{ rowData[header.value] }}
          </span>
        </template>
      </template>
      <template v-else>
        <edit-mode-button
          :mode="edit"
          :changed="rowChanged"
          @toggle-mode="edit = !edit"
          dir="right"
        ></edit-mode-button>
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
      rowData: {
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
      row: {}
    }),
    computed: {
      rowChanged () {
        return this.headers.some(header =>
          this.row[header.value] !== this.rowData[header.value]
        )
      }
    },
    watch: {
      edit (val) {
        if (val) {
          this.row = { ...this.rowData }
        } else if (this.rowChanged) {
          this.$store.dispatch('tableRow/update', this.row)
        }
      },
      override (val) {
        this.edit = true
      }
    }
  }
</script>
