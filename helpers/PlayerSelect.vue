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
  import { Vue, Prop, Component } from 'nuxt-property-decorator'

  @Component
  export default class PlayerSelect extends Vue {
    @Prop([String, Number]) value
    @Prop(Array) players
    @Prop(String, { default: 'Player' }) label
    @Prop(String, { default: 'mdi-account' }) icon
    @Prop(String, { default: 'player_id' }) itemValue
    @Prop(Boolean) required
    @Prop(Boolean) disabled
    @Prop(Boolean) clearable
    @Prop(Boolean) hideDetails

    get rules () {
      return this.required
        ? this.$_validate(this.label, ['required'])
        : []
    }

    updateValue (value) {
      this.$emit('input', value)
    }
  }
</script>
