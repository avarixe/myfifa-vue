<template lang="pug">
  v-autocomplete(
    v-model="nationality"
    :items="items"
    :label="label"
    :prepend-icon="icon"
    @change="emitValue"
  )
    template(#selection="{ item }")
      flag.mr-2(:iso="nationalities[item]")
      | {{ item }}
    template(#item="{ item }")
      v-list-item-avatar(size="20")
        flag(:iso="nationalities[item]")
      v-list-item-content
        v-list-item-title {{ item }}
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
