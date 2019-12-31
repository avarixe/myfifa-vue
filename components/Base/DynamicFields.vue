<template lang="pug">
  v-row(dense)
    v-scroll-y-transition(
      v-for="(field, i) in fields"
      :key="i"
      mode="out-in"
    )
      v-col(v-if="!field.hidden" :cols="field.cols || 12")
        dynamic-field(:object="object" :field="field")
          template(v-slot:[`field.${field.slot}`])
            slot(
              :name="`field.${field.slot}`"
              :object="field.object"
              :attribute="field.attribute"
            )
</template>

<script>
  import DynamicField from './DynamicField'

  export default {
    name: 'DynamicFields',
    components: {
      DynamicField
    },
    props: {
      object: {
        type: Object,
        default: () => ({})
      },
      fields: {
        type: Array,
        default: () => ([])
      }
    }
  }
</script>
