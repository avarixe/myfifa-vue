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
            v-else
            v-model="row[header.value]"
            :type="header.type"
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
      rowData: {
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
      row: {}
    }),
    watch: {
      edit (val) {
        if (val) {
          this.row = { ...this.rowData }
        } else {
          this.$store.dispatch('tableRow/update', this.row)
        }
      }
    }
  }
</script>
