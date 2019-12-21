<template lang="pug">
  div
    span.font-weight-bold {{ item.player_name }}
    |&nbsp;
    | {{ action }}
    |&nbsp;
    span.font-weight-bold {{ item.replaced_by }}
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class SubstitutionContent extends Vue {
    @Prop({ type: Object, required: true }) item

    get action () {
      return this.item.injured
        ? 'has been injured. Replaced by'
        : 'replaced by'
    }
  }
</script>
