<template>
  <v-select
    :value="value"
    @change="updateValue"
    :rules="rules"
    :items="players"
    :item-value="itemValue"
    item-text="name"
    :label="label"
    :prepend-icon="icon"
    :disabled="disabled"
    :clearable="clearable"
    :hide-details="hideDetails"
  >
    <template #item="{ item }">
      <v-list-item-action>
        <v-list-item-action-text>
          {{ item.pos }}
        </v-list-item-action-text>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item-content>
    </template>
  </v-select>
</template>

<script>
  export default {
    props: {
      value: {
        type: [String, Number]
      },
      players: {
        type: Array
      },
      label: {
        type: String,
        default: 'Player'
      },
      icon: {
        type: String,
        default: 'mdi-account'
      },
      itemValue: {
        type: String,
        default: 'player_id'
      },
      required: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      clearable: {
        type: Boolean,
        default: false
      },
      hideDetails: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      updateValue (value) {
        this.$emit('input', value)
      }
    },
    computed: {
      rules () {
        return this.required
          ? this.$_validate(this.label, ['required'])
          : []
      }
    }
  }
</script>
