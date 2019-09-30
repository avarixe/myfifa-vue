<template>
  <v-autocomplete
    v-model="nationality"
    :items="items"
    :label="label"
    :prepend-icon="icon"
    @change="emitValue"
  >
    <template #item="{ item }">
      <v-list-item-avatar size="20">
        <flag :iso="nationalities[item]" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="item" />
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
  import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { nationalities } from '@/models/Player'

  @Component
  export default class NationalityField extends Vue {
    @Prop([String, Number]) value
    @Prop({ type: String, default: 'Nationality' }) label
    @Prop({ type: String, default: 'mdi-flag' }) icon

    nationality = null

    get nationalities () {
      return nationalities
    }

    get items () {
      return Object.keys(nationalities).sort()
    }

    @Watch('value', { immediate: true })
    setNationality () {
      this.nationality = this.value
    }

    @Watch('nationality')
    emitValue (value) {
      this.$emit('input', value)
    }
  }
</script>
