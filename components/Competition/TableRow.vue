<template>
  <tr>
    <td
      v-for="(header, i) in headers"
      :key="i"
      :class="`text-xs-${header.align}`">
      <template v-if="header.value">
        <template v-if="edit && header.type">
          <v-text-field
            v-model="row[header.value]"
            :type="header.type"
            :label="header.text"
          ></v-text-field>
        </template>
        <template v-else>
          {{ rowData[header.value] }}
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
  export default {
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
    data () {
      return {
        edit: false,
        row: {}
      }
    },
    computed: {
    },
    watch: {
      edit (val) {
        if (!val) return
        this.row = { ...this.rowData }
      }
    }
  }
</script>
