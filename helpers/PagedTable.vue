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
  import { Vue, Component } from 'vue-property-decorator'

  @Component({
    props: {
      value: {
        type: Number,
        required: true
      },
      pageCount: {
        type: Number,
        required: true
      }
    }
  })
  export default class PagedTable extends Vue {
    updateValue (value) {
      this.$emit('input', value)
    }
  }
</script>
