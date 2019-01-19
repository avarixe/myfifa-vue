<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    item-key="id"
    no-data-text="No Matches Recorded"
    disable-initial-sort
    hide-actions
  >
    <template
      slot="headerCell"
      slot-scope="{ header }"
    >
      <span
        class="subheading font-weight-light text-success text--darken-3"
        v-text="header.text"
      />
    </template>
    <template
      slot="items"
      slot-scope="props"
    >
      <tr>
        <td
          v-for="(header, i) in headers"
          :key="i"
          :class="`text-xs-${header.align}`"
        >
          {{ props.item[header.value] }}
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    props: {
      seasonData: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      headers: [
        { text: 'Competition', value: 'competition', align: 'left', sortable: false },
        { text: 'GP', value: 'gp',     align: 'center', sortable: false },
        { text: 'W',  value: 'wins',   align: 'center', sortable: false },
        { text: 'D',  value: 'draws',  align: 'center', sortable: false },
        { text: 'L',  value: 'losses', align: 'center', sortable: false },
        { text: 'GF', value: 'gf',     align: 'center', sortable: false },
        { text: 'GA', value: 'ga',     align: 'center', sortable: false },
        { text: 'GD', value: 'gd',     align: 'center', sortable: false }
      ]
    }),
    computed: {
      rows () {
        return Object.entries(this.seasonData.results)
          .map(([competition, data]) => ({
            ...data,
            competition,
            gd: data.gf - data.ga,
            gp: data.wins + data.draws + data.losses
          }))
      }
    }
  }
</script>

<style scoped>
  >>> table.v-table tbody tr td {
    padding: 8px 16px;
    height: auto;
  }
</style>
