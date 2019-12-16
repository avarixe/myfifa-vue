<template>
  <v-select
    :items="players"
    :item-value="itemValue"
    item-text="name"
    :label="label"
    :prepend-icon="icon"
    :disabled="disabled"
    :clearable="clearable"
    :hide-details="hideDetails"
    :rules="rules"
    :value="value"
    @change="updateValue"
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
  import { requiredRule } from './utilities'

  @Component
  export default class PlayerSelect extends Vue {
    @Prop([String, Number]) value
    @Prop(Array) players
    @Prop({ type: String, default: 'Player' }) label
    @Prop({ type: String, default: 'mdi-account' }) icon
    @Prop({ type: String, default: 'player_id' }) itemValue
    @Prop(Boolean) required
    @Prop(Boolean) disabled
    @Prop(Boolean) clearable
    @Prop(Boolean) hideDetails

    get rules () {
      return this.required ? [requiredRule({ label: this.label })] : []
    }

    updateValue (value) {
      this.$emit('input', value)
    }
  }
</script>
