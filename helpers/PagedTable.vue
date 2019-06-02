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
  export default {
    props: {
      value: {
        type: Number,
        required: true
      },
      pageCount: {
        type: Number,
        required: true
      }
    },
    methods: {
      updateValue (value) {
        this.$emit('input', value)
      }
    }
  }
</script>
