<template>
  <tr>
    <td
      v-for="(header, i) in headers"
      :key="i"
      :class="`text-xs-${header.align}`">
      <template v-if="header.value">
        <template v-if="edit && header.type">
          <v-text-field
            v-model="fixture[header.value]"
            :type="header.type"
            :label="header.text"
            :autofocus="i === 0"
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
  export default {
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
    }
  }
</script>
