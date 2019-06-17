<template>
  <div>
    <slot name="table" />

    <div class="text-xs-center pt-2">
      <v-pagination
        v-if="pageCount > 1"
        :value="value"
        @input="updateValue"
        :length="pageCount"
      />
    </div>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class PagedTable extends Vue {
    @Prop(Number, { required: true }) value
    @Prop(Number, { required: true }) pageCount

    updateValue (value) {
      this.$emit('input', value)
    }
  }
</script>
